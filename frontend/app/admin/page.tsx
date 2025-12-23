'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-routes';
import { AdminStats } from '@/components/admin-stats';
import { InvestmentApproval } from '@/components/investment-approval';
import { Shield, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [pendingInvestments, setPendingInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, pendingRes] = await Promise.all([
                apiClient.get(API_ENDPOINTS.admin.stats),
                apiClient.get(API_ENDPOINTS.admin.pendingInvestments)
            ]);

            setStats(statsRes.data.stats);
            setPendingInvestments(pendingRes.data.investments);
        } catch (err: any) {
            console.error('Admin dashboard error:', err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                setError('Unauthorized access. Admin privileges required.');
            } else {
                setError('Failed to load dashboard data.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
                        ))}
                    </div>
                    <div className="h-64 bg-muted rounded animate-pulse" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Platform overview and management</p>
                    </div>
                </div>

                {stats && <AdminStats stats={stats} />}

                <div className="mt-8">
                    <InvestmentApproval
                        investments={pendingInvestments}
                        onApprove={fetchData}
                    />
                </div>
            </div>
        </div>
    );
}
