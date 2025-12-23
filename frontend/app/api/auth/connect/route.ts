import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const body = await req.json();
        const { publicKey, signature, message } = body;

        if (!publicKey || !signature || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
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
                return NextResponse.json(
                    { error: 'Invalid signature' },
                    { status: 401 }
                );
            }
        } catch (err) {
            console.error('Verification error:', err);
            return NextResponse.json(
                { error: 'Signature verification failed' },
                { status: 400 }
            );
        }

        // Find or create user
        let user = await User.findOne({ walletAddress: publicKey });

        if (!user) {
            user = await User.create({
                walletAddress: publicKey,
            });
        } else {
            user.lastLogin = new Date();
            await user.save();
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                walletAddress: user.walletAddress,
                role: user.role,
                profile: user.profile,
            },
        });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
