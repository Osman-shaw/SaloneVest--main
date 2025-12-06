import { Request, Response } from 'express';
import Investment from '../models/Investment';
import Transaction from '../models/Transaction';
import Portfolio from '../models/Portfolio';
import User from '../models/User';
import { connection } from '../config/solana';

export const getAllInvestments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, category, risk, status } = req.query;

        const filter: any = {};
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (risk) filter.risk = risk;
        if (status) filter.status = status;
        else filter.status = 'active'; // Default to active

        const investments = await Investment.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: investments.length,
            investments
        });
    } catch (error) {
        console.error('Error fetching investments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getInvestmentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const investment = await Investment.findById(id);

        if (!investment) {
            res.status(404).json({ error: 'Investment not found' });
            return;
        }

        res.json({ success: true, investment });
    } catch (error) {
        console.error('Error fetching investment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createInvestmentTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress, investmentId, amount, txHash } = req.body;

        // Validate inputs
        if (!walletAddress || !investmentId || !amount || !txHash) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Find user
        const user = await User.findOne({ walletAddress });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Find investment
        const investment = await Investment.findById(investmentId);
        if (!investment) {
            res.status(404).json({ error: 'Investment not found' });
            return;
        }

        // Verify minimum investment
        if (amount < investment.minimumInvestment) {
            res.status(400).json({
                error: `Minimum investment is ${investment.minimumInvestment} USDC`
            });
            return;
        }

        // Verify transaction on Solana
        try {
            const txInfo = await connection.getTransaction(txHash, {
                maxSupportedTransactionVersion: 0
            });

            if (!txInfo) {
                res.status(400).json({ error: 'Transaction not found on blockchain' });
                return;
            }
        } catch (error) {
            console.error('Solana verification error:', error);
            res.status(400).json({ error: 'Failed to verify transaction' });
            return;
        }

        // Create transaction record
        const transaction = await Transaction.create({
            user: user._id,
            investment: investment._id,
            amount,
            txHash,
            status: 'confirmed',
            fee: 0.000005, // Typical Solana fee
        });

        // Update or create portfolio entry
        let portfolio = await Portfolio.findOne({
            user: user._id,
            investment: investment._id
        });

        if (portfolio) {
            portfolio.principal += amount;
            portfolio.currentValue += amount;
            portfolio.lastUpdated = new Date();
            await portfolio.save();
        } else {
            portfolio = await Portfolio.create({
                user: user._id,
                investment: investment._id,
                principal: amount,
                currentValue: amount,
            });
        }

        // Update investment total raised
        investment.totalRaised += amount;
        if (investment.totalRaised >= investment.targetAmount) {
            investment.status = 'funded';
        }
        await investment.save();

        res.json({
            success: true,
            transaction: {
                id: transaction._id,
                txHash: transaction.txHash,
                amount: transaction.amount,
                status: transaction.status,
                timestamp: transaction.timestamp,
            },
            portfolio: {
                principal: portfolio.principal,
                currentValue: portfolio.currentValue,
            }
        });
    } catch (error) {
        console.error('Error creating investment transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
