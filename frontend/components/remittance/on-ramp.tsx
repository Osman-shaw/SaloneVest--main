"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CreditCard } from "lucide-react"

export function OnRamp() {
    const [amount, setAmount] = useState("")
    const [currency, setCurrency] = useState("USD")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success">("idle")

    const handleBuy = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
        setStatus("success")
        // In a real app, this would trigger a wallet balance update
    }

    if (status === "success") {
        return (
            <div className="text-center space-y-4 py-8 animate-in fade-in zoom-in">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Purchase Successful!</h3>
                <p className="text-muted-foreground">
                    {amount} {currency} worth of USDC has been added to your wallet.
                </p>
                <Button onClick={() => setStatus("idle")} variant="outline">
                    Buy More
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Buy USDC</h3>
                <p className="text-sm text-muted-foreground">
                    Convert your local currency to USDC instantly.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label>Amount</Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="flex-1"
                        />
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Exchange Rate</span>
                        <span>1 {currency} ≈ 1 USDC</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Network Fee</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                        <span>You Receive</span>
                        <span>{amount || "0"} USDC</span>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={handleBuy}
                    disabled={!amount || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Buy USDC"
                    )}
                </Button>
            </div>
        </div>
    )
}
