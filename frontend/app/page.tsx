"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already connected
    const checkWalletConnection = async () => {
      if (typeof window !== "undefined" && window.phantom?.solana?.isConnected) {
        setIsConnected(true)
        router.push("/dashboard")
      }
    }
    checkWalletConnection()
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
