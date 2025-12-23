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
    if (!walletConnected) {
      router.push("/")
    } else {
      setIsConnected(true)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar isConnected={isConnected} />
      <PortfolioView />
    </main>
  )
}
