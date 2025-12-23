"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface WalletConnectProps {
  isConnected?: boolean
}

export function WalletConnect({ isConnected = false }: WalletConnectProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePhantomConnect = async () => {
    setIsLoading(true)
    try {
      // Check if Phantom is installed
      if (!window.phantom?.solana) {
        window.open("https://phantom.app/", "_blank")
        setIsLoading(false)
        return
      }

      // Request connection
      const response = await window.phantom?.solana?.connect()

      if (response?.publicKey) {
        // Store wallet connection
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("publicKey", response.publicKey.toString())

        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePhantomConnect}
      disabled={isLoading}
      className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-11"
    >
      {isLoading ? "Connecting..." : isConnected ? "Connected" : "Connect Phantom"}
    </Button>
  )
}
