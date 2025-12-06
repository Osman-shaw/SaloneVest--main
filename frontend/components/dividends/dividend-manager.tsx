"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Coins, HandCoins, History } from "lucide-react"

export function DividendManager() {
    const [amount, setAmount] = useState("")
    const [sharePrice, setSharePrice] = useState("")
    const [unclaimedDividends, setUnclaimedDividends] = useState(125.50)
    const [isClaiming, setIsClaiming] = useState(false)

    const handleIssueDividend = () => {
        toast.success("Dividend Issued Successfully", {
            description: `Distributed $${amount} to all shareholders at $${sharePrice}/share.`
        })
        setAmount("")
        setSharePrice("")
    }

    const handleClaimDividend = async () => {
        setIsClaiming(true)
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.success("Dividends Claimed!", {
            description: `$${unclaimedDividends.toFixed(2)} has been added to your wallet balance.`
        })
        setUnclaimedDividends(0)
        setIsClaiming(false)
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HandCoins className="h-5 w-5 text-primary" />
                            Unclaimed Dividends
                        </CardTitle>
                        <CardDescription>Earnings waiting to be claimed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-4">${unclaimedDividends.toFixed(2)}</div>
                        <Button
                            className="w-full"
                            onClick={handleClaimDividend}
                            disabled={unclaimedDividends === 0 || isClaiming}
                        >
                            {isClaiming ? "Processing..." : "Claim to Wallet"}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5 text-muted-foreground" />
                            Recent Payouts
                        </CardTitle>
                        <CardDescription>Last 3 dividend distributions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { date: "2023-11-01", amount: 45.20, source: "Lion Mountain Ag" },
                                { date: "2023-10-15", amount: 12.50, source: "Easy Solar" },
                                { date: "2023-09-30", amount: 67.80, source: "Freetown Plaza" },
                            ].map((payout, i) => (
                                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-sm">{payout.source}</p>
                                        <p className="text-xs text-muted-foreground">{payout.date}</p>
                                    </div>
                                    <span className="font-semibold text-green-600">+${payout.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-muted-foreground" />
                        Issue Dividends (Admin/Startup View)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 items-end">
                        <div className="space-y-2">
                            <Label>Total Distribution Amount ($)</Label>
                            <Input
                                type="number"
                                placeholder="10000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Dividend Per Share ($)</Label>
                            <Input
                                type="number"
                                placeholder="0.50"
                                value={sharePrice}
                                onChange={(e) => setSharePrice(e.target.value)}
                            />
                        </div>
                        <Button variant="secondary" onClick={handleIssueDividend}>
                            Distribute Now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
