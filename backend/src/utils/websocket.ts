import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initWebSocket = (httpServer: HttpServer, corsOrigin: string) => {
    io = new Server(httpServer, {
        cors: {
            origin: corsOrigin,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join_wallet', (walletAddress: string) => {
            socket.join(walletAddress);
            console.log(`Socket ${socket.id} joined room: ${walletAddress}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

export const sendNotification = (walletAddress: string, type: string, payload: any) => {
    if (io) {
        io.to(walletAddress).emit('notification', { type, payload, timestamp: Date.now() });
    }
};
