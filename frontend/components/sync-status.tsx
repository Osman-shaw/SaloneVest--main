'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { offlineQueue } from '@/lib/offline-queue';
import { useOffline } from '@/hooks/use-offline'; // Assuming this exists or needs creation

export function SyncStatus() {
    const isOffline = useOffline(); // We might need to create this hook if it doesn't exist
    const [pendingCount, setPendingCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        // Update count on mount and when online status changes
        const updateCount = () => {
            setPendingCount(offlineQueue.getPendingCount());
        };

        updateCount();
        window.addEventListener('storage', updateCount);

        // Poll for changes every 5 seconds
        const interval = setInterval(updateCount, 5000);

        return () => {
            window.removeEventListener('storage', updateCount);
            clearInterval(interval);
        };
    }, []);

    if (!isOffline && pendingCount === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${isOffline
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                {isOffline ? (
                    <>
                        <WifiOff className="h-5 w-5" />
                        <div>
                            <div className="font-medium">You are offline</div>
                            {pendingCount > 0 && (
                                <div className="text-xs opacity-90">
                                    {pendingCount} transaction{pendingCount !== 1 ? 's' : ''} queued
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {isSyncing ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                            <Wifi className="h-5 w-5" />
                        )}
                        <div>
                            <div className="font-medium">
                                {isSyncing ? 'Syncing...' : 'Back online'}
                            </div>
                            {pendingCount > 0 && !isSyncing && (
                                <div className="text-xs opacity-90">
                                    {pendingCount} pending to sync
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
