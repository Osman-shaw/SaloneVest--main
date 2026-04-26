"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { InvestmentDashboard } from "@/components/investment-dashboard"
import {
  isSolanaWalletReady,
  waitForSolanaWallet,
  clearStoredWalletSession,
  syncStoredWalletFromProvider,
} from "@/lib/solana-wallet"

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const ready = await waitForSolanaWallet()
      if (cancelled) return
      if (!ready) {
        clearStoredWalletSession()
        router.replace("/")
        return
      }
      syncStoredWalletFromProvider()
      setIsConnected(true)
      setIsLoading(false)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [router])

  useEffect(() => {
    if (isLoading) return
    const onVisible = () => {
      if (document.visibilityState !== "visible") return
      if (!isSolanaWalletReady()) {
        clearStoredWalletSession()
        router.replace("/")
      } else {
        syncStoredWalletFromProvider()
      }
    }
    window.addEventListener("focus", onVisible)
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.removeEventListener("focus", onVisible)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [router, isLoading])

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

  return (
    <main className="min-h-screen bg-background">
      <Navbar isConnected={isConnected} />
      <InvestmentDashboard />
    </main>
  )
}
