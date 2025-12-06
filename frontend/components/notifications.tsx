'use client';

import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { useState } from 'react';

interface NotificationsProps {
    walletAddress: string | null;
}

export function Notifications({ walletAddress }: NotificationsProps) {
    const { notifications } = useNotifications(walletAddress);
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-muted rounded-full transition-colors"
            >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/50">
                        <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No new notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {notifications.map((notif, index) => (
                                    <div key={index} className="p-4 hover:bg-muted/50 transition-colors">
                                        <div className="text-sm font-medium mb-1 capitalize">
                                            {notif.type.replace('_', ' ')}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {JSON.stringify(notif.payload)}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {new Date(notif.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
