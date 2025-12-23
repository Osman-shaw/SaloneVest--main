import { Request, Response } from 'express';
import User from '../models/User';
import Investment from '../models/Investment';
import Transaction from '../models/Transaction';

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalInvestments = await Investment.countDocuments();
        const totalTransactions = await Transaction.countDocuments();

        // Calculate total volume
        const transactions = await Transaction.find({ status: 'confirmed' });
        const totalVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalInvestments,
                totalTransactions,
                totalVolume
            }
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

export const getPendingInvestments = async (req: Request, res: Response) => {
    try {
        // Assuming 'status' field exists and 'pending' is a valid state for vetting
        // For now, we'll return all investments that are not 'active'
        const investments = await Investment.find({ status: { $ne: 'active' } });
        res.json({ success: true, investments });
    } catch (error) {
        console.error('Get pending investments error:', error);
        res.status(500).json({ error: 'Failed to fetch pending investments' });
    }
};

export const approveInvestment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const investment = await Investment.findByIdAndUpdate(
            id,
            { status: 'active', 'details.verified': true },
            { new: true }
        );
        import { Request, Response } from 'express';
        import User from '../models/User';
        import Investment from '../models/Investment';
        import Transaction from '../models/Transaction';

        export const getAdminStats = async (req: Request, res: Response) => {
            try {
                const totalUsers = await User.countDocuments();
                const totalInvestments = await Investment.countDocuments();
                const totalTransactions = await Transaction.countDocuments();

                // Calculate total volume
                const transactions = await Transaction.find({ status: 'confirmed' });
                const totalVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);

                res.json({
                    success: true,
                    stats: {
                        totalUsers,
                        totalInvestments,
                        totalTransactions,
                        totalVolume
                    }
                });
            } catch (error) {
                console.error('Get admin stats error:', error);
                res.status(500).json({ error: 'Failed to fetch admin stats' });
            }
        };

        export const getPendingInvestments = async (req: Request, res: Response) => {
            try {
                // Assuming 'status' field exists and 'pending' is a valid state for vetting
                // For now, we'll return all investments that are not 'active'
                const investments = await Investment.find({ status: { $ne: 'active' } });
                res.json({ success: true, investments });
            } catch (error) {
                console.error('Get pending investments error:', error);
                res.status(500).json({ error: 'Failed to fetch pending investments' });
            }
        };

        export const approveInvestment = async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const investment = await Investment.findByIdAndUpdate(
                    id,
                    { status: 'active', 'details.verified': true },
                    { new: true }
                );

                if (!investment) {
                    return res.status(404).json({ error: 'Investment not found' });
                }

                res.json({ success: true, investment });
            } catch (error) {
                console.error('Approve investment error:', error);
                res.status(500).json({ error: 'Failed to approve investment' });
            }
        };

        export const updateVettingStatus = async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const { stageId, status } = req.body;

                const investment = await Investment.findById(id);
                if (!investment) {
                    return res.status(404).json({ error: 'Investment not found' });
                }

                if (!investment.details) investment.details = {};
                if (!investment.details.vettingStages) {
                    investment.details.vettingStages = [];
                }

                const stageIndex = investment.details.vettingStages.findIndex(s => s.id === stageId);
                if (stageIndex >= 0) {
                    investment.details.vettingStages[stageIndex].status = status;
                    if (status === 'completed') {
                        investment.details.vettingStages[stageIndex].date = new Date();
                    }
                } else {
                    investment.details.vettingStages.push({
                        id: stageId,
                        label: stageId.charAt(0).toUpperCase() + stageId.slice(1), // Simple label generation
                        status,
                        date: status === 'completed' ? new Date() : undefined
                    });
                }

                await investment.save();
                res.json({ success: true, investment });
            } catch (error) {
                console.error('Update vetting status error:', error);
                res.status(500).json({ error: 'Failed to update vetting status' });
            }
        };
