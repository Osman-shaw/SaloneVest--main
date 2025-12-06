import { Request, Response } from 'express';
import User from '../models/User';
import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

export const connectWallet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { publicKey, signature, message } = req.body;

        // Validate inputs
        if (!publicKey || !signature || !message) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Verify signature
        try {
            const signatureUint8 = bs58.decode(signature);
            const messageUint8 = new TextEncoder().encode(message);
            const publicKeyUint8 = new PublicKey(publicKey).toBytes();

            const verified = nacl.sign.detached.verify(
                messageUint8,
                signatureUint8,
                publicKeyUint8
            );

            if (!verified) {
                res.status(401).json({ error: 'Invalid signature' });
                return;
            }
        } catch (err) {
            console.error('Verification error:', err);
            res.status(400).json({ error: 'Signature verification failed' });
            return;
        }

        // Find or create user
        let user = await User.findOne({ walletAddress: publicKey });

        if (!user) {
            user = await User.create({
                walletAddress: publicKey,
            });
            console.log(`✅ New user created: ${publicKey}`);
        } else {
            user.lastLogin = new Date();
            await user.save();
            console.log(`✅ User logged in: ${publicKey}`);
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                role: user.role,
                profile: user.profile,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
