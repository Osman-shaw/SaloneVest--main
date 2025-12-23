"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/hooks/use-wallet"
import { signInvestmentTransaction } from "@/lib/solana-utils"
import { AlertCircle } from "lucide-react"

interface Investment {
  id: string
  name: string
  expectedYield: string
  minInvestment: string
}

interface InvestModalProps {
  investment: Investment
  isOpen: boolean
  onClose: () => void
}

export function InvestModal({ investment, isOpen, onClose }: InvestModalProps) {
  const [amount, setAmount] = useState("")
  const [isSigningTx, setIsSigningTx] = useState(false)
  const [error, setError] = useState("")
  const { wallet, isConnected, publicKey } = useWallet()
  const router = useRouter()

  if (!isOpen) return null

  const gasFee = 0.001
  const traditionalFee = amount ? (Number.parseFloat(amount) * 0.08).toFixed(2) : "0"
  const userSavings = amount ? (Number.parseFloat(traditionalFee) - gasFee).toFixed(2) : "0"

  const handleConfirmInvestment = async () => {
    setError("")

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (!wallet || !isConnected || !publicKey) {
      setError("Wallet not connected. Please connect your Phantom wallet.")
      return
    }

    setIsSigningTx(true)

    try {
      const result = await signInvestmentTransaction(
        {
          publicKey,
          signTransaction: wallet.signTransaction.bind(wallet),
          signAllTransactions: wallet.signAllTransactions?.bind(wallet),
        },
        investment.id,
        Number.parseFloat(amount),
      )

      if (result.success && result.txHash) {
        const params = new URLSearchParams({
          id: investment.id,
          amount: amount,
          txId: result.txHash,
          date: new Date().toISOString().split("T")[0],
        })

        router.push(`/invoice?${params.toString()}`)
        onClose()
      } else {
        setError("Transaction failed. Please try again.")
      }
    } catch (err) {
      console.error("Investment error:", err)
      setError(err instanceof Error ? err.message : "Failed to process investment")
    } finally {
      setIsSigningTx(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-4 md:p-0">
      <div className="w-full max-w-md rounded-t-2xl md:rounded-2xl bg-card border border-border p-6 shadow-xl max-h-[90vh] overflow-y-auto md:max-h-none">
        <h2 className="text-2xl font-bold text-foreground mb-6">Invest in {investment.name}</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Investment Amount (USDC)</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSigningTx}
              className="rounded-lg h-11"
            />
            <p className="text-xs text-muted-foreground">Minimum: {investment.minInvestment}</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
            <div className="text-sm font-medium text-foreground">Fee Comparison</div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Blockchain Fee (SaloneVest)</span>
                <span className="font-semibold text-primary">${gasFee.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Traditional Remittance Fee</span>
                <span className="font-semibold text-red-600">${traditionalFee}</span>
              </div>
              {amount && (
                <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
                  <span className="text-foreground">You Save</span>
                  <span className="text-primary">${userSavings}</span>
                </div>
              )}
            </div>
          </div>

          {!isConnected && (
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please connect your Phantom wallet to proceed with investment.
              </p>
            </div>
          )}

          <div className="space-y-2 pt-4">
            <Button
              onClick={handleConfirmInvestment}
              disabled={isSigningTx || !isConnected}
              className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg h-11"
            >
              {isSigningTx ? "Signing Transaction..." : isConnected ? "Confirm & Sign" : "Connect Wallet First"}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSigningTx}
              className="w-full rounded-lg bg-transparent h-11"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
