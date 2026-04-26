"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"
import { waitForSolanaWallet, syncStoredWalletFromProvider } from "@/lib/solana-wallet"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    const checkWalletConnection = async () => {
      const ready = await waitForSolanaWallet(12, 100)
      if (cancelled) return
      if (ready) {
        syncStoredWalletFromProvider()
        setIsConnected(true)
        router.replace("/dashboard")
      }
    }
    void checkWalletConnection()
    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <main className="min-h-screen bg-background">
      <Navbar isConnected={isConnected} />
      <Hero onConnect={() => setIsConnected(true)} />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}
