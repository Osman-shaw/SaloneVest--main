"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowDownLeft } from "lucide-react"

export function OffRamp() {
    const [amount, setAmount] = useState("")
    const [method, setMethod] = useState("orange")
    const [accountNumber, setAccountNumber] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success">("idle")

    const exchangeRate = 22.5 // Mock rate: 1 USDC = 22.5 SLE

    const handleWithdraw = async () => {
        setIsLoading(true)
        // Simulate withdrawal process
        await new Promise((resolve) => setTimeout(resolve, 2500))
        setIsLoading(false)
        setStatus("success")
    }

    if (status === "success") {
        return (
            <div className="text-center space-y-4 py-8 animate-in fade-in zoom-in">
                <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                    <ArrowDownLeft className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Withdrawal Initiated!</h3>
                <p className="text-muted-foreground">
                    {amount} USDC is being converted to SLE and sent to your {method === "orange" ? "Orange Money" : method === "africell" ? "Africell Money" : "Bank"} account.
                </p>
                <Button onClick={() => setStatus("idle")} variant="outline">
                    New Withdrawal
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Withdraw to Local Currency</h3>
                <p className="text-sm text-muted-foreground">
                    Convert USDC to Leone (SLE) and withdraw to Mobile Money or Bank.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label>Amount (USDC)</Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Withdrawal Method</Label>
                    <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="orange">Orange Money</SelectItem>
                            <SelectItem value="africell">Africell Money</SelectItem>
                            <SelectItem value="bank">Bank Transfer (Rokel/Ecobank)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Account Number / Phone</Label>
                    <Input
                        placeholder={method === "bank" ? "Account Number" : "07X XXX XXX"}
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                    />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Exchange Rate</span>
                        <span>1 USDC ≈ {exchangeRate} SLE</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Fee</span>
                        <span>1%</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                        <span>You Receive</span>
                        <span>{amount ? (parseFloat(amount) * exchangeRate * 0.99).toFixed(2) : "0"} SLE</span>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={handleWithdraw}
                    disabled={!amount || !accountNumber || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Withdraw Funds"
                    )}
                </Button>
            </div>
        </div>
    )
}
