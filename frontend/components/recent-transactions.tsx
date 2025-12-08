"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Clock, TrendingUp } from "lucide-react"

interface Transaction {
  id: string
  investmentName: string
  amount: number
  date: string
  status: "pending" | "completed" | "failed"
  type: "investment" | "withdrawal" | "dividend"
}

interface RecentTransactionsProps {
  walletAddress?: string
}

export function RecentTransactions({ walletAddress }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!walletAddress) {
          setLoading(false)
          return
        }

        const response = await fetch(`/api/transactions?walletAddress=${walletAddress}`)
        if (response.ok) {
          const data = await response.json()
          setTransactions(data.transactions || [])
        } else {
          // Show mock data if endpoint doesn't exist yet
          setTransactions([])
        }
      } catch (error) {
        console.log("Transactions data not yet available - showing empty state")
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [walletAddress])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200"
      case "pending":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200"
      case "failed":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200"
      default:
        return "bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "investment":
        return <ArrowUpRight className="h-4 w-4" />
      case "dividend":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start investing to see your transaction history here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    {getTypeIcon(tx.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {tx.investmentName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <p className="text-sm font-semibold text-foreground">
                    ${tx.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </p>
                  <Badge
                    variant="outline"
                    className={`capitalize text-xs ${getStatusColor(tx.status)}`}
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
