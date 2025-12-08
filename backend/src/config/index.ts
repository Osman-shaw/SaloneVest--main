import { config as solanaConfig } from './solana';

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
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        expiresIn: '7d',
    },
};

export default config;
