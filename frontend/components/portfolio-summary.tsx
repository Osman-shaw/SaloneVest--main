"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, PieChart, Target } from "lucide-react"

interface PortfolioSummaryProps {
  walletAddress?: string
}

export function PortfolioSummary({ walletAddress }: PortfolioSummaryProps) {
  const [portfolioData, setPortfolioData] = useState({
    totalBalance: 0,
    totalInvested: 0,
    activeInvestments: 0,
    expectedReturns: 0,
    loading: true
  })

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        if (!walletAddress) {
          setPortfolioData(prev => ({ ...prev, loading: false }))
          return
        }

        const response = await fetch(`/api/portfolio?walletAddress=${walletAddress}`)
        if (response.ok) {
          const data = await response.json()
          setPortfolioData({
            totalBalance: data.totalBalance || 0,
            totalInvested: data.totalInvested || 0,
            activeInvestments: data.activeInvestments || 0,
            expectedReturns: data.expectedReturns || 0,
            loading: false
          })
        } else {
          // Default values if endpoint doesn't exist yet
          setPortfolioData(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.log("Portfolio data not yet available")
        setPortfolioData(prev => ({ ...prev, loading: false }))
      }
    }

    fetchPortfolioData()
  }, [walletAddress])

  const stats = [
    {
      label: "Total Balance",
      value: `$${portfolioData.totalBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      label: "Total Invested",
      value: `$${portfolioData.totalInvested.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      label: "Active Investments",
      value: portfolioData.activeInvestments.toString(),
      icon: PieChart,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      label: "Expected Returns",
      value: `$${portfolioData.expectedReturns.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ]

  if (portfolioData.loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-20 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
