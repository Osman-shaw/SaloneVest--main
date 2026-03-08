import { config as solanaConfig } from './solana';

// All secrets must come from .env only. Never hardcode MONGODB_URI (e.g. mongodb+srv://...) or JWT_SECRET.
const jwtSecret = process.env.JWT_SECRET;
if (process.env.NODE_ENV === 'production' && !jwtSecret) {
    throw new Error('JWT_SECRET must be set in .env in production');
}

export const config = {
    ...solanaConfig,
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
