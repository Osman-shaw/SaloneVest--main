import { Request, Response } from 'express';
import User from '../models/User';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress } = req.params;

        if (!walletAddress) {
            res.status(400).json({ error: 'Wallet address required' });
            return;
        }

        const user = await User.findOne({ walletAddress });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                role: user.role,
                profile: user.profile,
                settings: user.settings,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { walletAddress } = req.params;
        const { profile, settings, role, status } = req.body;

        if (!walletAddress) {
            res.status(400).json({ error: 'Wallet address required' });
            return;
        }

        const updateData: any = {};
        if (profile) updateData.profile = profile;
        if (settings) updateData.settings = settings;
        if (role) updateData.role = role;
        if (status) updateData.status = status;

        const user = await User.findOneAndUpdate(
            { walletAddress },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                role: user.role,
                profile: user.profile,
                settings: user.settings,
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });

        res.json({
            success: true,
            users: users.map(user => ({
                id: user._id,
                walletAddress: user.walletAddress,
                role: user.role,
                profile: user.profile,
                settings: user.settings,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
                status: 'active' // Mock status for now as it might not be in schema
            }))
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
