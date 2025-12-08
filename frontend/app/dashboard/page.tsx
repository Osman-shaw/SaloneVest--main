"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { InvestmentDashboard } from "@/components/investment-dashboard"
import { AccountSummary } from "@/components/account-summary"
import { PortfolioSummary } from "@/components/portfolio-summary"
import { RecentTransactions } from "@/components/recent-transactions"

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const walletConnected = localStorage.getItem("walletConnected") === "true"
    const address = localStorage.getItem("walletAddress")
    
    if (walletConnected && address) {
      setIsConnected(true)
      setWalletAddress(address)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar isConnected={false} />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Connect Your Wallet
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Please connect your Phantom wallet to access the investment dashboard.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-4">Click the "Connect Phantom" button in the top right to get started.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar isConnected={isConnected} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Welcome back! Here's your investment overview.
            </p>
          </div>

          {/* Account & Portfolio Overview Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Account Summary - Takes 1/3 on desktop */}
            <div className="lg:col-span-1">
              <AccountSummary walletAddress={walletAddress} />
            </div>

            {/* Portfolio Summary Stats - Takes 2/3 on desktop */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Portfolio Overview</h2>
                <PortfolioSummary walletAddress={walletAddress} />
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Activity</h2>
            <RecentTransactions walletAddress={walletAddress} />
          </div>

          {/* Investment Opportunities Section */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Explore More Opportunities</h2>
            <InvestmentDashboard />
          </div>
        </div>
      </div>
    </main>
  )
}
