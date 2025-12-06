'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getInvestmentById } from '@/lib/api-routes';
import { ArrowLeft, Shield, TrendingUp, Calendar, MapPin, Check } from 'lucide-react';
import Link from 'next/link';

export default function InvestmentDetailPage() {
    const params = useParams();
    const [investment, setInvestment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvestment = async () => {
            if (params.id) {
                const result = await getInvestmentById(params.id as string);
                if (result && result.success) {
                    setInvestment(result.investment);
                }
                setLoading(false);
            }
        };

        fetchInvestment();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-4xl">
                    <div className="h-8 w-32 bg-muted rounded animate-pulse mb-6" />
                    <div className="h-64 bg-muted rounded animate-pulse" />
                </div>
            </div>
        );
    }

    if (!investment) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-2xl font-bold mb-4">Investment Not Found</h1>
                    <Link href="/dashboard" className="text-primary hover:underline">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const riskColor: Record<string, string> = {
        low: 'text-green-600 bg-green-50',
        moderate: 'text-yellow-600 bg-yellow-50',
        high: 'text-red-600 bg-red-50',
    };
    const colorClass = riskColor[investment.risk.toLowerCase()] || riskColor.moderate;

    const progress = (investment.totalRaised / investment.targetAmount) * 100;

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-4xl p-6">
                {/* Back Button */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Discover
                </Link>

                {/* Header */}
                <div className="bg-card border border-border rounded-lg p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{investment.name}</h1>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskColor}`}>
                                    {investment.risk.toUpperCase()} RISK
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    {investment.type.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">Expected Yield</div>
                            <div className="text-3xl font-bold text-primary">{investment.expectedYield}%</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                                ${investment.totalRaised.toLocaleString()} / ${investment.targetAmount.toLocaleString()}
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{progress.toFixed(1)}% funded</div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{investment.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Investment Details</h2>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">Minimum Investment</dt>
                                <dd className="font-medium">${investment.minimumInvestment} USDC</dd>
                            </div>
                            {investment.details?.sector && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Sector</dt>
                                    <dd className="font-medium">{investment.details.sector}</dd>
                                </div>
                            )}
                            {investment.details?.location && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        Location
                                    </dt>
                                    <dd className="font-medium">{investment.details.location}</dd>
                                </div>
                            )}
                            {investment.details?.duration && (
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Duration
                                    </dt>
                                    <dd className="font-medium">{investment.details.duration}</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Verification Status
                        </h2>
                        <div className="space-y-3">
                            {investment.details?.verified && (
                                <div className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="font-medium">Fully Vetted</div>
                                        <div className="text-sm text-muted-foreground">
                                            3-stage vetting process completed
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-medium">Blockchain Verified</div>
                                    <div className="text-sm text-muted-foreground">
                                        All transactions recorded on Solana
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Check className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-medium">USDC Protected</div>
                                    <div className="text-sm text-muted-foreground">
                                        Currency risk eliminated
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">Ready to invest?</h3>
                    <p className="text-muted-foreground mb-4">
                        Connect your Phantom wallet and start investing in {investment.name}
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        <TrendingUp className="h-5 w-5" />
                        Invest Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
