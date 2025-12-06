"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { signInvestmentTransaction } from "@/lib/solana-utils"
import { toast } from "sonner"

interface InvestModalProps {
  isOpen: boolean
  onClose: () => void
  investmentTitle: string
  minAmount: number
  currentPrice?: number
}

export function InvestModal({ isOpen, onClose, investmentTitle, minAmount, currentPrice }: InvestModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInvest = async () => {
    setError("")
    setIsLoading(true)

    try {
      // 1. Validate Amount
      const investAmount = parseFloat(amount)
      if (isNaN(investAmount) || investAmount < minAmount) {
        throw new Error(`Minimum investment is $${minAmount}`)
      }

      // 2. Check Wallet Connection
      const provider = window.phantom?.solana
      if (!(provider as any)?.isPhantom || !provider?.publicKey) {
        throw new Error("Please connect your Phantom wallet first")
      }

      // 3. Sign Transaction
      const { success, txHash } = await signInvestmentTransaction(
        { publicKey: provider.publicKey, signTransaction: provider.signTransaction },
        investmentTitle, // Using title as ID for demo
        investAmount
      )

      if (!success) throw new Error("Transaction failed or rejected")

      // 4. Success Handling
      toast.success("Investment Successful!", {
        description: `You have successfully invested $${investAmount} in ${investmentTitle}.`,
      })
      onClose()
      router.push(`/invoice?id=${txHash}&amount=${investAmount}&item=${encodeURIComponent(investmentTitle)}`)

    } catch (err: any) {
      console.error("Investment error:", err)
      setError(err.message || "An error occurred during investment")
      toast.error("Investment Failed", {
        description: err.message || "Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invest in {investmentTitle}</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to invest. Minimum investment is ${minAmount}.
            {currentPrice && (
              <span className="block mt-1 text-primary font-medium">
                Current Share Price: ${currentPrice.toFixed(2)}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Investment Amount (USDC)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                placeholder={minAmount.toString()}
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {currentPrice && amount && (
              <p className="text-xs text-muted-foreground text-right">
                Est. Shares: {(parseFloat(amount) / currentPrice).toFixed(4)}
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground">
            <p className="flex items-center gap-1 mb-1">
              <Wallet className="h-3 w-3" /> Wallet: Phantom (Devnet)
            </p>
            <p>Transaction will be processed on Solana Devnet. Ensure you have SOL for gas fees.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleInvest} disabled={isLoading} className="gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Processing..." : "Confirm & Sign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
