'use client'

import { useState } from 'react'
import { RemittanceFlow } from "@/components/remittance/remittance-flow"
import { WithdrawalForm } from '@/components/remittance/withdrawal-form'
import { WithdrawalHistory } from '@/components/remittance/withdrawal-history'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser } from '@/context/user-context'
import { useBalance } from '@/hooks/use-balance'

export default function RemitPage() {
    const { user } = useUser()
    const { balance } = useBalance()
    const [activeTab, setActiveTab] = useState('send')

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card>
                    <CardHeader>
                        <CardTitle>Authentication Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Please log in to access remittance features.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Remit Without Borders</h1>
                    <p className="text-lg text-muted-foreground">
                        Send money to Sierra Leone instantly with near-zero fees.
                        Convert Fiat to USDC, transfer via Solana, and withdraw to Local Mobile Money.
                    </p>
                </div>

                {/* Tabs for Send/Withdraw */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full max-w-md mx-0 grid-cols-2">
                        <TabsTrigger value="send">💸 Send Money</TabsTrigger>
                        <TabsTrigger value="withdraw">💰 Withdraw</TabsTrigger>
                    </TabsList>

                    {/* Send Money Tab */}
                    <TabsContent value="send" className="mt-6">
                        <RemittanceFlow />
                    </TabsContent>

                    {/* Withdraw Tab */}
                    <TabsContent value="withdraw" className="mt-6">
                        <div className="space-y-6">
                            {/* Payment Methods Info */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">🏦 Bank Transfer</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm text-muted-foreground">2% fee</p>
                                        <p className="text-sm text-muted-foreground">2-3 business days</p>
                                        <p className="text-xs text-muted-foreground">International and local banks</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">📱 Orange Money</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm text-muted-foreground">1% fee</p>
                                        <p className="text-sm text-muted-foreground">1-2 hours</p>
                                        <p className="text-xs text-muted-foreground">Instant mobile money</p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">📱 Afromo Money</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="text-sm text-muted-foreground">1% fee</p>
                                        <p className="text-sm text-muted-foreground">30 min - 1 hour</p>
                                        <p className="text-xs text-muted-foreground">Fastest option</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Withdrawal Form */}
                                <div className="lg:col-span-2">
                                    <WithdrawalForm balance={balance} userId={user.id} />
                                </div>

                                {/* Info Sidebar */}
                                <div className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">Current Balance</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</p>
                                            <p className="text-sm text-muted-foreground mt-1">USDC</p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">How It Works</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-sm">
                                            <div>
                                                <p className="font-semibold mb-1">1. Request</p>
                                                <p className="text-muted-foreground">Submit withdrawal</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-1">2. Approve</p>
                                                <p className="text-muted-foreground">Admin reviews</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-1">3. Process</p>
                                                <p className="text-muted-foreground">Funds transferred</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-1">4. Receive</p>
                                                <p className="text-muted-foreground">Money in account</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-blue-50 border-blue-200">
                                        <CardHeader>
                                            <CardTitle className="text-base">Security</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-sm text-blue-900">
                                            All withdrawals verified by admin. Your data is encrypted and secure.
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Withdrawal History */}
                            <WithdrawalHistory userId={user.id} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
