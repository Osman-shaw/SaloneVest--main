import { VercelRequest, VercelResponse } from '@vercel/node';
import app, { connectDB } from '../src/server';

// Initialize database connection
let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }

    // Forward request to Express app
    return app(req as any, res as any);
}
