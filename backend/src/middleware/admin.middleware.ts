import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { isAuthorizedAdmin } from '../services/solana.service';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get wallet address from headers or authenticated user
        const walletAddress = req.headers['x-wallet-address'] as string || (req as any).user?.walletAddress;

        if (!walletAddress) {
            return res.status(401).json({ error: 'Unauthorized: No wallet address provided' });
        }

        // Check user role in database
        const user = await User.findOne({ walletAddress });

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        // Additionally verify against blockchain admin PDA (if program is deployed)
        try {
            const isBlockchainAdmin = await isAuthorizedAdmin(walletAddress);
            if (!isBlockchainAdmin) {
                console.warn(`User ${walletAddress} is admin in DB but not on blockchain`);
                // For now, allow DB admin to proceed, but log the discrepancy
                // In production, you might want to enforce blockchain verification
            }
        } catch (blockchainError) {
            console.error('Blockchain admin check failed:', blockchainError);
            // Continue with DB check if blockchain check fails
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
