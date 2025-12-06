import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export interface Investment {
    id: string;
    name: string;
    type: string;
    riskLevel: string;
    expectedYield: string;
    minInvestment: string;
    description: string;
    targetAmount: number;
    totalRaised: number;
    symbol?: string;
}

export function useInvestments() {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                // Try to fetch from backend
                const response = await apiClient.get('/api/investments');
                if (response.data && Array.isArray(response.data)) {
                    setInvestments(response.data);
                } else {
                    // Fallback to empty or mock if needed, but for now just empty
                    setInvestments([]);
                }
            } catch (err) {
                console.error("Failed to fetch investments:", err);
                setError("Failed to load investments");
                // Fallback to mock data if backend fails (for demo purposes)
                // In a real app, we might show an error state
                setInvestments([
                    {
                        id: "1",
                        name: "Easy Solar",
                        type: "Impact",
                        riskLevel: "Low",
                        expectedYield: "12.5%",
                        minInvestment: "$50",
                        description: "Leading distributor of solar energy solutions across West Africa.",
                        targetAmount: 100000,
                        totalRaised: 75000,
                        symbol: "SOLAR"
                    },
                    {
                        id: "2",
                        name: "Monime",
                        type: "Growth",
                        riskLevel: "High",
                        expectedYield: "24.5%",
                        minInvestment: "$100",
                        description: "Fintech platform bridging the gap between cash and digital finance.",
                        targetAmount: 200000,
                        totalRaised: 45000,
                        symbol: "MONI"
                    },
                    // ... more mock data if needed
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    return { investments, loading, error };
}
