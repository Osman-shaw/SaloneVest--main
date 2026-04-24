import {
    SOLANA_RPC_URL,
    SOLANA_NETWORK,
    SALONEVEST_PROGRAM_ID,
} from './solana';

// All secrets must come from .env only. Never hardcode MONGODB_URI or JWT_SECRET.
const jwtSecret = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && !jwtSecret) {
    throw new Error('JWT_SECRET must be set in .env in production');
}

const adminWallets = (process.env.ADMIN_WALLETS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const config = {
    solana: {
        rpcUrl: process.env.SOLANA_RPC_URL || SOLANA_RPC_URL,
        network: process.env.SOLANA_NETWORK || SOLANA_NETWORK,
        programId: process.env.PROGRAM_ID || SALONEVEST_PROGRAM_ID.toBase58(),
        adminWallets,
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/salonevest',
    },
    server: {
        port: process.env.PORT || 5000,
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    jwt: {
        secret: jwtSecret || 'dev-only-change-in-production',
        expiresIn: '7d',
    },
};

export default config;
