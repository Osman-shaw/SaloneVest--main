import { Request, Response } from 'express';
import Withdrawal from '../models/Withdrawal';
import User from '../models/User';
import Portfolio from '../models/Portfolio';

/**
 * POST /api/withdrawals
 * Create a new withdrawal request
 */
export const createWithdrawal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            walletAddress, 
            amount, 
            paymentMethod, 
            bankDetails, 
            mobileMoneyDetails 
        } = req.body;

        // Validate inputs
        if (!walletAddress || !amount || !paymentMethod) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Validate payment method
        const validMethods = ['bank_transfer', 'orange_money', 'afromo_money'];
        if (!validMethods.includes(paymentMethod)) {
            res.status(400).json({ error: 'Invalid payment method' });
            return;
        }

        // Find user
        const user = await User.findOne({ walletAddress });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check user balance by summing portfolio investments
        const portfolioInvestments = await Portfolio.find({ user: user._id });
        const totalBalance = portfolioInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
        
        if (totalBalance < amount) {
            res.status(400).json({ error: 'Insufficient balance' });
            return;
        }

        // Validate payment method details
        if (paymentMethod === 'bank_transfer' && !bankDetails) {
            res.status(400).json({ error: 'Bank details required for bank transfer' });
            return;
        }

        if ((paymentMethod === 'orange_money' || paymentMethod === 'afromo_money') && !mobileMoneyDetails) {
            res.status(400).json({ error: 'Mobile money details required' });
            return;
        }

        // Calculate withdrawal fee (2% standard, 1% for mobile money to encourage adoption)
        const feePercentage = (paymentMethod === 'orange_money' || paymentMethod === 'afromo_money') ? 0.01 : 0.02;
        const fee = Math.round(amount * feePercentage * 100) / 100; // Round to 2 decimals
        const netAmount = amount - fee;

        // Create withdrawal request
        const withdrawal = new Withdrawal({
            user: user._id,
            amount,
            paymentMethod,
            bankDetails: paymentMethod === 'bank_transfer' ? bankDetails : undefined,
            mobileMoneyDetails: (paymentMethod === 'orange_money' || paymentMethod === 'afromo_money') ? mobileMoneyDetails : undefined,
            fee,
            netAmount,
            status: 'pending'
        });

        await withdrawal.save();

        res.status(201).json({
            success: true,
            message: 'Withdrawal request created successfully',
            withdrawal: {
                id: withdrawal._id,
                amount: withdrawal.amount,
                fee: withdrawal.fee,
                netAmount: withdrawal.netAmount,
                paymentMethod: withdrawal.paymentMethod,
                status: withdrawal.status,
                createdAt: withdrawal.createdAt
            }
        });
    } catch (error) {
        console.error('Error creating withdrawal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/withdrawals/:userId
 * Get withdrawal history for a user
 */
export const getUserWithdrawals = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const withdrawals = await Withdrawal.find({ user: userId })
            .sort({ createdAt: -1 })
            .select('-bankDetails.swiftCode'); // Don't expose sensitive swift codes

        res.json({
            success: true,
            count: withdrawals.length,
            withdrawals
        });
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/withdrawals
 * Get all withdrawal requests (admin only)
 */
export const getAllWithdrawals = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, paymentMethod, limit = 20, skip = 0 } = req.query;

        const filter: any = {};
        if (status) filter.status = status;
        if (paymentMethod) filter.paymentMethod = paymentMethod;

        const withdrawals = await Withdrawal.find(filter)
            .populate('user', 'walletAddress email name')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip));

        const total = await Withdrawal.countDocuments(filter);

        res.json({
            success: true,
            total,
            count: withdrawals.length,
            withdrawals
        });
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PUT /api/withdrawals/:id/approve
 * Approve a withdrawal (admin only)
 */
export const approveWithdrawal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { adminId, transactionReference } = req.body;

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            res.status(404).json({ error: 'Withdrawal not found' });
            return;
        }

        if (withdrawal.status !== 'pending') {
            res.status(400).json({ error: 'Withdrawal is not pending' });
            return;
        }

        withdrawal.status = 'approved';
        withdrawal.approvedBy = adminId;
        withdrawal.transactionReference = transactionReference;
        await withdrawal.save();

        res.json({
            success: true,
            message: 'Withdrawal approved',
            withdrawal
        });
    } catch (error) {
        console.error('Error approving withdrawal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PUT /api/withdrawals/:id/process
 * Process/complete a withdrawal (admin only)
 */
export const processWithdrawal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            res.status(404).json({ error: 'Withdrawal not found' });
            return;
        }

        if (withdrawal.status !== 'approved') {
            res.status(400).json({ error: 'Withdrawal must be approved first' });
            return;
        }

        // Deduct from user portfolio (sum all currentValue)
        // In a real system, this would deduct from specific investments or a balance account
        const portfolios = await Portfolio.find({ user: withdrawal.user });
        if (portfolios.length > 0) {
            // Deduct from the first investment's currentValue
            portfolios[0].currentValue = Math.max(0, portfolios[0].currentValue - withdrawal.amount);
            await portfolios[0].save();
        }

        withdrawal.status = 'processed';
        withdrawal.processedDate = new Date();
        await withdrawal.save();

        res.json({
            success: true,
            message: 'Withdrawal processed successfully',
            withdrawal
        });
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * PUT /api/withdrawals/:id/cancel
 * Cancel a withdrawal (user can cancel if pending, admin can cancel anytime)
 */
export const cancelWithdrawal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            res.status(404).json({ error: 'Withdrawal not found' });
            return;
        }

        if (withdrawal.status === 'processed' || withdrawal.status === 'failed') {
            res.status(400).json({ error: 'Cannot cancel a processed or failed withdrawal' });
            return;
        }

        withdrawal.status = 'cancelled';
        withdrawal.failureReason = reason || 'Cancelled by user';
        await withdrawal.save();

        res.json({
            success: true,
            message: 'Withdrawal cancelled',
            withdrawal
        });
    } catch (error) {
        console.error('Error cancelling withdrawal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/withdrawals/stats/summary
 * Get withdrawal statistics (admin)
 */
export const getWithdrawalStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const stats = await Withdrawal.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalFees: { $sum: '$fee' }
                }
            }
        ]);

        const methodStats = await Withdrawal.aggregate([
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        res.json({
            success: true,
            byStatus: stats,
            byPaymentMethod: methodStats
        });
    } catch (error) {
        console.error('Error fetching withdrawal stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
