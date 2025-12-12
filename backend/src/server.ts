import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import investmentRoutes from './routes/investment.routes';
import portfolioRoutes from './routes/portfolio.routes';
import balanceRoutes from './routes/balance.routes';
import adminRoutes from './routes/admin.routes';
import seedRoutes from './routes/seed.routes';
import withdrawalRoutes from './routes/withdrawal.routes';

import { createServer } from 'http';
import { initWebSocket } from './utils/websocket';

// ... (imports)

// Load environment variables
dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'SaloneVest Backend API'
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
});

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Initialize WebSocket
        initWebSocket(httpServer, FRONTEND_URL);

        // Start listening
        httpServer.listen(PORT, () => {
            console.log(`\n🚀 SaloneVest Backend Server`);
            console.log(`📡 Server running on http://localhost:${PORT}`);
            console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`⚡ WebSocket initialized`);
            console.log(`\n✅ Ready to accept requests\n`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Only start server if run directly (not imported)
if (require.main === module) {
    startServer();
}

export default app;
export { connectDB }; // Export for Vercel handler

