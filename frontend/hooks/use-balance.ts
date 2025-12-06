'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUSDCBalance } from '../lib/api-routes';

interface UseBalanceReturn {
    balance: number | null;
    formatted: string;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useBalance(walletAddress: string | null): UseBalanceReturn {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = useCallback(async () => {
        if (!walletAddress) {
            setBalance(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await getUSDCBalance(walletAddress);
            if (result && result.success) {
                setBalance(result.balance);
            } else {
                setError('Failed to fetch balance');
            }
        } catch (err) {
            console.error('Balance fetch error:', err);
            setError('Error fetching balance');
            setBalance(0);
        } finally {
            setLoading(false);
        }
    }, [walletAddress]);

    useEffect(() => {
        fetchBalance();

        // Refresh balance every 30 seconds
        const interval = setInterval(fetchBalance, 30000);

        return () => clearInterval(interval);
    }, [fetchBalance]);

    const formatted = balance !== null
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(balance)
        : '$0.00';

    return {
        balance,
        formatted,
        loading,
        error,
        refresh: fetchBalance,
    };
}
