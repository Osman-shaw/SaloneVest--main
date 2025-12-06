import { Request, Response } from 'express';
import Portfolio from '../models/Portfolio';
import Transaction from '../models/Transaction';
import User from '../models/User';

export const getUserPortfolio = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress } = req.params;

        const user = await User.findOne({ walletAddress });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const holdings = await Portfolio.find({ user: user._id })
            .populate('investment')
            .sort({ purchaseDate: -1 });

        const totalInvestment = holdings.reduce((sum, h) => sum + h.principal, 0);
        const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
        const totalReturns = holdings.reduce((sum, h) => sum + h.accruedReturns, 0);

        res.json({
            success: true,
            summary: {
                totalInvestment,
                totalValue,
                totalReturns,
                roi: totalInvestment > 0 ? ((totalValue - totalInvestment) / totalInvestment) * 100 : 0,
                holdingsCount: holdings.length,
            },
            holdings: holdings.map(h => ({
                investmentId: h.investment._id,
                investmentName: (h.investment as any).name,
                principal: h.principal,
                currentValue: h.currentValue,
                accruedReturns: h.accruedReturns,
                purchaseDate: h.purchaseDate,
                roi: h.principal > 0 ? ((h.currentValue - h.principal) / h.principal) * 100 : 0,
            })),
        });
    } catch (error) {
        console.error('Error fetching portfolio:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPortfolioPerformance = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress } = req.params;

        const user = await User.findOne({ walletAddress });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Get all transactions for this user
        const transactions = await Transaction.find({
            user: user._id,
            status: 'confirmed'
        }).sort({ timestamp: 1 });

        // Generate performance data (simplified - can be enhanced)
        const performanceData = transactions.map((tx, index) => {
            const cumulativeInvestment = transactions
                .slice(0, index + 1)
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                date: tx.timestamp,
                investment: cumulativeInvestment,
                value: cumulativeInvestment * 1.05, // Simplified growth
            };
        });

        res.json({
            success: true,
            performance: performanceData,
        });
    } catch (error) {
        console.error('Error fetching performance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTransactionHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress } = req.params;

        const user = await User.findOne({ walletAddress });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const transactions = await Transaction.find({ user: user._id })
            .populate('investment')
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({
            success: true,
            count: transactions.length,
            transactions: transactions.map(tx => ({
                id: tx._id,
                investmentName: (tx.investment as any).name,
                amount: tx.amount,
                txHash: tx.txHash,
                status: tx.status,
                fee: tx.fee,
                timestamp: tx.timestamp,
            })),
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
