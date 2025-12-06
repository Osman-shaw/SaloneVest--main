"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PortfolioChart } from "./portfolio-chart"
import { AssetBreakdown } from "./asset-breakdown"
import { TransactionHistory } from "./transaction-history"
import { AnalyticsDashboard } from "./analytics/analytics-dashboard"
import { DividendManager } from "./dividends/dividend-manager"
import { ArrowUpRight, Wallet, PieChart, Activity } from "lucide-react"
import { usePriceFeed } from "@/context/price-feed-context"

import { usePortfolio } from "@/hooks/use-portfolio"

export function PortfolioView() {
  const { prices } = usePriceFeed()
  const { portfolio, stats, loading } = usePortfolio()

  // Calculate real-time portfolio value if stats not available or to update with live prices
  const portfolioValue = portfolio.reduce((total, asset) => {
    // Map asset name/symbol to price feed key if needed, for now assume symbol matches
    const currentPrice = prices[asset.name]?.price || asset.currentValue / asset.shares // Fallback to last known price
    return total + (asset.shares * currentPrice)
  }, 0)

  const totalInvested = stats?.totalInvested || portfolio.reduce((total, asset) => total + asset.amount, 0)

  const totalReturn = portfolioValue - totalInvested
  const returnPercentage = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(2) : "0.00"
  const isPositive = totalReturn >= 0

  if (loading) {
    return <div className="p-8 text-center">Loading portfolio...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="dividends">Dividends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalInvested.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across {portfolio.length} assets
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                <ArrowUpRight className={`h-4 w-4 ${isPositive ? "text-green-500" : "text-red-500"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : ""}${Math.abs(totalReturn).toFixed(2)}
                </div>
                <p className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : ""}{returnPercentage}% all time
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolio.length}</div>
                <p className="text-xs text-muted-foreground">
                  Diversified across 4 sectors
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <PortfolioChart />
              </CardContent>
            </Card>
            <div className="col-span-3">
              <AssetBreakdown />
            </div>
          </div>

          <TransactionHistory />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="dividends">
          <DividendManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
