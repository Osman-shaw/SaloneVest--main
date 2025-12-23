"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Printer as Print, Home } from "lucide-react"

export default function InvoicePage() {
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const walletConnected = localStorage.getItem("walletConnected") === "true"
    if (!walletConnected) {
      router.push("/")
    } else {
      setIsConnected(true)
    }
  }, [router])

  const investmentId = searchParams.get("id") || "1"
  const amount = searchParams.get("amount") || "2500.00"
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
  const txId = searchParams.get("txId") || "SOL_" + Math.random().toString(36).substring(2, 15)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    console.log("Downloading invoice...")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Print Styles */}
        <style>{`
          @media print {
            body { background: white; }
            .no-print { display: none; }
            .print-area { box-shadow: none; border: none; }
          }
        `}</style>

        {/* Invoice */}
        <Card className="print-area">
          <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border pb-6 md:pb-8 gap-4">
              <div>
                <div className="rounded-lg bg-primary p-2 mb-2">
                  <div className="h-8 w-8 bg-primary-foreground rounded" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">SaloneVest</h1>
                <p className="text-xs md:text-sm text-muted-foreground">Investment Confirmation Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-xs md:text-sm text-muted-foreground">Invoice Date</p>
                <p className="text-base md:text-lg font-semibold text-foreground">{date}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Transaction ID</p>
                <p className="font-mono text-xs md:text-sm text-foreground break-all">{txId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Transaction Date</p>
                <p className="text-xs md:text-sm text-foreground">{date}</p>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="bg-secondary/50 rounded-lg p-4 md:p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Investment Asset</p>
                <p className="text-base md:text-lg font-semibold text-foreground">Sierra Leone Tech Fund</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Investment Amount</p>
                  <p className="text-2xl md:text-3xl font-bold text-primary">${amount}</p>
                  <p className="text-xs text-muted-foreground mt-1">USDC</p>
                </div>
                <div className="md:text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Transaction Fee</p>
                  <p className="text-2xl md:text-3xl font-bold text-primary">$0.001</p>
                  <p className="text-xs text-muted-foreground mt-1">Solana Network</p>
                </div>
              </div>
            </div>

            {/* Fee Comparison */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">How Much You Saved</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3 md:p-4">
                  <p className="text-red-900 dark:text-red-200 text-xs uppercase tracking-wider mb-1">
                    Traditional Bank
                  </p>
                  <p className="text-lg md:text-xl font-bold text-red-600">-$200.00</p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">8% remittance fee</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 md:p-4">
                  <p className="text-green-900 dark:text-green-200 text-xs uppercase tracking-wider mb-1">SaloneVest</p>
                  <p className="text-lg md:text-xl font-bold text-green-600">-$0.001</p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">Blockchain fee</p>
                </div>
              </div>
              <div className="bg-primary/5 border border-primary rounded-lg p-3 md:p-4 mt-4">
                <p className="text-xs md:text-sm">
                  <span className="font-semibold text-primary">Total Saved:</span>{" "}
                  <span className="font-bold text-base md:text-lg text-primary">$199.999</span>
                </p>
              </div>
            </div>

            {/* Blockchain Details */}
            <div className="bg-muted/50 rounded-lg p-3 md:p-4 space-y-2 text-xs md:text-sm font-mono text-muted-foreground">
              <p>Blockchain Network: Solana</p>
              <p>Token: USDC (Circle USD Coin)</p>
              <p>Confirmations: 32 (Finalized)</p>
            </div>

            {/* Terms */}
            <div className="text-xs text-muted-foreground space-y-2 border-t border-border pt-6">
              <p>
                This receipt confirms your investment transaction on the SaloneVest platform. Your funds have been
                securely recorded on the Solana blockchain using Program Derived Addresses (PDAs).
              </p>
              <p>
                All investments are subject to the Terms of Service and Risk Disclosure Statement available at{" "}
                <span className="font-mono text-primary">saloneVest.io/legal</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="no-print flex flex-col md:flex-row gap-3 mt-6 md:mt-8">
          <Button
            onClick={handlePrint}
            className="flex-1 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg h-11 gap-2"
          >
            <Print className="h-4 w-4" />
            <span className="hidden sm:inline">Print Receipt</span>
            <span className="sm:hidden">Print</span>
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1 rounded-lg bg-transparent h-11 gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">Download</span>
          </Button>
          <Button onClick={() => router.push("/portfolio")} variant="outline" className="flex-1 rounded-lg h-11 gap-2">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">View Portfolio</span>
            <span className="sm:hidden">Portfolio</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
