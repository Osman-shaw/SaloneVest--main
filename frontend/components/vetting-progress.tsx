'use client';

import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface VettingStage {
    id: string;
    label: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
}

interface VettingProgressProps {
    stages: VettingStage[];
}

export function VettingProgress({ stages }: VettingProgressProps) {
    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Verification Process</h3>
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />

                <div className="space-y-6 relative">
                    {stages.map((stage) => (
                        <div key={stage.id} className="flex items-start gap-4">
                            <div className="relative z-10 bg-background">
                                {stage.status === 'completed' ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                ) : stage.status === 'current' ? (
                                    <Clock className="h-6 w-6 text-blue-600 animate-pulse" />
                                ) : (
                                    <Circle className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <div className={`font-medium ${stage.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                                    }`}>
                                    {stage.label}
                                </div>
                                {stage.date && (
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        Completed on {stage.date}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
