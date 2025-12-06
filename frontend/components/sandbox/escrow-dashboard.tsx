"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Lock, Wallet } from "lucide-react"

export function EscrowDashboard() {
    const totalFunding = 50000 // Mock Total Funding in USDC
    const disbursed = 12500 // Mock Disbursed Amount
    const remaining = totalFunding - disbursed

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                    BSL Regulatory Sandbox Mode Active
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Funding Secured</CardTitle>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalFunding.toLocaleString()} USDC</div>
                        <p className="text-xs text-muted-foreground">Held in Smart Contract Escrow</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Disbursed to Date</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${disbursed.toLocaleString()} USDC</div>
                        <p className="text-xs text-muted-foreground">Converted to SLL for Expenses</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Remaining in Escrow</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${remaining.toLocaleString()} USDC</div>
                        <p className="text-xs text-muted-foreground">Protected from FX Depreciation</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
