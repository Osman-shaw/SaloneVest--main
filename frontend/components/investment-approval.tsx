'use client';

import { Check, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import apiClient from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-routes';

interface Investment {
    _id: string;
    name: string;
    type: string;
    targetAmount: number;
    status: string;
    createdAt: string;
}

interface InvestmentApprovalProps {
    investments: Investment[];
    onApprove: () => void;
}

export function InvestmentApproval({ investments, onApprove }: InvestmentApprovalProps) {
    const [processing, setProcessing] = useState<string | null>(null);

    const handleApprove = async (id: string) => {
        setProcessing(id);
        try {
            await apiClient.put(API_ENDPOINTS.admin.approveInvestment(id));
            onApprove(); // Refresh list
        } catch (error) {
            console.error('Approval failed:', error);
        } finally {
            setProcessing(null);
        }
    };

    if (investments.length === 0) {
        return (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">No pending investments requiring approval.</p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Pending Approvals
                </h2>
            </div>
            <div className="divide-y divide-border">
                {investments.map((inv) => (
                    <div key={inv._id} className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                        <div>
                            <h3 className="font-medium text-lg mb-1">{inv.name}</h3>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <span className="capitalize bg-muted px-2 py-0.5 rounded">
                                    {inv.type}
                                </span>
                                <span>Target: ${inv.targetAmount.toLocaleString()}</span>
                                <span>Created: {new Date(inv.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleApprove(inv._id)}
                                disabled={!!processing}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                                {processing === inv._id ? 'Processing...' : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Approve
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
