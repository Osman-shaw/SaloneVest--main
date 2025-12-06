'use client';

import { Users, TrendingUp, Activity, DollarSign } from 'lucide-react';

interface AdminStatsProps {
    stats: {
        totalUsers: number;
        totalInvestments: number;
        totalTransactions: number;
        totalVolume: number;
    };
}

export function AdminStats({ stats }: AdminStatsProps) {
    const items = [
        {
            label: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-blue-600 bg-blue-50',
        },
        {
            label: 'Total Investments',
            value: stats.totalInvestments.toLocaleString(),
            icon: TrendingUp,
            color: 'text-green-600 bg-green-50',
        },
        {
            label: 'Transactions',
            value: stats.totalTransactions.toLocaleString(),
            icon: Activity,
            color: 'text-purple-600 bg-purple-50',
        },
        {
            label: 'Total Volume',
            value: `$${stats.totalVolume.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-yellow-600 bg-yellow-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {items.map((item) => (
                <div key={item.label} className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">
                                {item.label}
                            </p>
                            <h3 className="text-2xl font-bold">{item.value}</h3>
                        </div>
                        <div className={`p-3 rounded-full ${item.color}`}>
                            <item.icon className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
