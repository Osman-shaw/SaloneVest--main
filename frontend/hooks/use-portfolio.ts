import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { useUser } from '@/context/user-context';

export interface PortfolioItem {
    investmentId: string;
    name: string;
    amount: number;
    shares: number;
    currentValue: number;
    roi: number;
}

export interface PortfolioStats {
    totalValue: number;
    totalInvested: number;
    totalProfit: number;
    roi: number;
}

export function usePortfolio() {
    const { user } = useUser();
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [stats, setStats] = useState<PortfolioStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!user?.publicKey) {
                setLoading(false);
                return;
            }

            try {
                const [portfolioRes, performanceRes] = await Promise.all([
                    api.portfolio.get(user.publicKey),
                    api.portfolio.getPerformance(user.publicKey)
                ]);

                setPortfolio(portfolioRes.data.investments || []);
                setStats(performanceRes.data);
            } catch (err) {
                console.error("Failed to fetch portfolio:", err);
                setError("Failed to load portfolio data");
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [user?.publicKey]);

    return { portfolio, stats, loading, error };
}
