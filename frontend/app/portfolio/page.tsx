"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PortfolioView } from "@/components/portfolio-view"

export default function PortfolioPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const walletConnected = localStorage.getItem("walletConnected") === "true"
    if (walletConnected) {
      setIsConnected(true)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary" />
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
              Please connect your Phantom wallet to view your portfolio.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-4">Click the "Connect Phantom" button in the top right or below to get started.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar isConnected={isConnected} />
      <PortfolioView />
    </main>
  )
}
