"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AccountSummaryProps {
  walletAddress?: string
}

export function AccountSummary({ walletAddress }: AccountSummaryProps) {
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [connectedTime, setConnectedTime] = useState<string>("")

  useEffect(() => {
    const connectedAt = localStorage.getItem("walletConnectedAt")
    if (connectedAt) {
      const date = new Date(connectedAt)
      setConnectedTime(date.toLocaleString())
    }
  }, [])

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopiedAddress(true)
      toast.success("Address copied to clipboard")
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5" />
          Wallet Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {walletAddress && (
          <>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">WALLET ADDRESS</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted p-2 rounded font-mono break-all">
                  {walletAddress}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyToClipboard}
                  className="h-8 w-8 p-0"
                >
                  {copiedAddress ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {connectedTime && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">CONNECTED SINCE</p>
                <p className="text-sm text-foreground">{connectedTime}</p>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">NETWORK</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200">
                  Solana Devnet
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">STATUS</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
