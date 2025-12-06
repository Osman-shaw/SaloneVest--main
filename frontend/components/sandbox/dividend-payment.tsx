"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, RefreshCw, CheckCircle } from "lucide-react"

export function DividendPayment() {
    const [sllAmount, setSllAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success">("idle")

    const exchangeRate = 22.5 // Mock rate: 1 USDC = 22.5 SLE
    const usdcAmount = sllAmount ? (parseFloat(sllAmount) / exchangeRate).toFixed(2) : "0.00"

    const handlePayment = async () => {
        setIsLoading(true)
        // Simulate payment processing and conversion
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setIsLoading(false)
        setStatus("success")
    }

    if (status === "success") {
        return (
            <div className="text-center space-y-4 py-8 animate-in fade-in zoom-in bg-muted/30 rounded-lg border border-border">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Dividends Distributed!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    <strong>{sllAmount} SLE</strong> has been successfully converted to <strong>${usdcAmount} USDC</strong> and distributed to your investors' wallets.
                </p>
                <Button onClick={() => setStatus("idle")} variant="outline">
                    Process Another Payment
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Repatriate Dividends</h3>
                <p className="text-sm text-muted-foreground">
                    Pay dividends in SLL. We instantly convert and distribute USDC to investors.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label>Profit Amount (SLE)</Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={sllAmount}
                        onChange={(e) => setSllAmount(e.target.value)}
                    />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Exchange Rate</span>
                        <span>{exchangeRate} SLE ≈ 1 USDC</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Platform Fee</span>
                        <span>0% (Sandbox Waived)</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Investors Receive</span>
                        <span className="text-green-600">${usdcAmount} USDC</span>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={handlePayment}
                    disabled={!sllAmount || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Conversion...
                        </>
                    ) : (
                        "Pay Dividends"
                    )}
                </Button>
            </div>
        </div>
    )
}
