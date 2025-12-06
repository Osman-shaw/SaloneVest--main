'use client';

import { Clock, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

interface Transaction {
    id: string;
    investmentName: string;
    amount: number;
    txHash: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: Date;
    fee: number;
}

interface TransactionStatusProps {
    transactions: Transaction[];
}

export function TransactionStatus({ transactions }: TransactionStatusProps) {
    if (transactions.length === 0) {
        return (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No recent transactions</p>
            </div>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-yellow-600 animate-pulse" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="text-green-600 font-medium">Confirmed</span>;
            case 'failed':
                return <span className="text-red-600 font-medium">Failed</span>;
            default:
                return <span className="text-yellow-600 font-medium">Pending</span>;
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="border-b border-border p-4">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-border">
                {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(tx.status)}
                                <div>
                                    <div className="font-medium">{tx.investmentName}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {new Date(tx.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">${tx.amount.toLocaleString()} USDC</div>
                                <div className="text-xs text-muted-foreground">
                                    Fee: ${tx.fee.toFixed(6)}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div>{getStatusText(tx.status)}</div>
                            {tx.txHash && (
                                <a
                                    href={`https://solscan.io/tx/${tx.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                >
                                    View on Solscan
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
