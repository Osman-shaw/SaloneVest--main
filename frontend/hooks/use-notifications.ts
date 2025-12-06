'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
    type: string;
    payload: any;
    timestamp: number;
}

export function useNotifications(walletAddress: string | null) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!walletAddress) return;

        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

        socketInstance.on('connect', () => {
            console.log('Connected to WebSocket');
            socketInstance.emit('join_wallet', walletAddress);
        });

        socketInstance.on('notification', (notification: Notification) => {
            setNotifications((prev) => [notification, ...prev]);
            // You could also trigger a toast here
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [walletAddress]);

    return { notifications, socket };
}
