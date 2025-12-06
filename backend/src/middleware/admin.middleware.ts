import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // In a real app, you'd verify the JWT token or session here
        // For this MVP, we'll check the wallet address sent in headers
        const walletAddress = req.headers['x-wallet-address'];

        if (!walletAddress) {
            return res.status(401).json({ error: 'Unauthorized: No wallet address provided' });
        }

        const user = await User.findOne({ walletAddress });

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
