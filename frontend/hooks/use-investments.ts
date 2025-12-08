import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { opportunities } from '@/lib/opportunities-data';

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

// Map opportunities data to Investment interface
const mapOpportunitiesToInvestments = (): Investment[] => {
    return opportunities.map((opp) => ({
        id: opp.id,
        name: opp.name,
        type: opp.category === 'startup' ? 'Growth' 
            : opp.category === 'mutual_fund' ? 'Income'
            : opp.category === 'government_bond' ? 'Impact'
            : opp.category === 'treasury_bill' ? 'Income'
            : 'Growth',
        riskLevel: opp.riskLevel.charAt(0).toUpperCase() + opp.riskLevel.slice(1),
        expectedYield: `${opp.roi}%`,
        minInvestment: `$${opp.minInvestment?.toLocaleString() || '100'}`,
        description: opp.description,
        targetAmount: opp.fundingGoal,
        totalRaised: opp.fundingCurrent,
        symbol: opp.name.split(' ').slice(0, 2).join('').toUpperCase()
    }));
};

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
                    // Fallback to opportunities data
                    setInvestments(mapOpportunitiesToInvestments());
                }
            } catch (err) {
                console.error("Failed to fetch investments:", err);
                setError("Failed to load investments from backend, using local data");
                // Fallback to opportunities data if backend fails
                setInvestments(mapOpportunitiesToInvestments());
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    return { investments, loading, error };
}
