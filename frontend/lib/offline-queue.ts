export interface QueuedTransaction {
    id: string;
    type: 'INVESTMENT' | 'PROFILE_UPDATE';
    payload: any;
    timestamp: number;
    status: 'PENDING' | 'SYNCING' | 'FAILED';
    retryCount: number;
}

const STORAGE_KEY = 'salonevest_offline_queue';

export const offlineQueue = {
    // Add transaction to queue
    add: (type: QueuedTransaction['type'], payload: any) => {
        const queue = offlineQueue.getAll();
        const tx: QueuedTransaction = {
            id: crypto.randomUUID(),
            type,
            payload,
            timestamp: Date.now(),
            status: 'PENDING',
            retryCount: 0,
        };
        queue.push(tx);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
        return tx;
    },

    // Get all queued transactions
    getAll: (): QueuedTransaction[] => {
        if (typeof window === 'undefined') return [];
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    // Remove transaction
    remove: (id: string) => {
        const queue = offlineQueue.getAll().filter(tx => tx.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    },

    // Update transaction status
    updateStatus: (id: string, status: QueuedTransaction['status']) => {
        const queue = offlineQueue.getAll().map(tx =>
            tx.id === id ? { ...tx, status } : tx
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    },

    // Clear queue
    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    // Get pending count
    getPendingCount: () => {
        return offlineQueue.getAll().filter(tx => tx.status === 'PENDING').length;
    }
};
