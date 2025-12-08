"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { connectPhantom, isPhantomInstalled } from "@/lib/phantom-types"
import bs58 from "bs58"

interface WalletConnectProps {
  readonly isConnected?: boolean
}

export default function WalletConnect({ isConnected = false }: WalletConnectProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { publicKey, signMessage, connected, disconnect } = useWallet()
  const { login } = useUser()

  // Auto-login when wallet connects
  useEffect(() => {
    const handleAutoLogin = async () => {
      if (connected && publicKey && signMessage && !isConnected) {
        setIsLoading(true)
        try {
          // Sign message for backend auth
          const message = `Sign this message to authenticate with SaloneVest. Timestamp: ${Date.now()}`
          const encodedMessage = new TextEncoder().encode(message)
          const signature = await signMessage(encodedMessage)

          // Store wallet address and connection time
          localStorage.setItem("walletAddress", publicKey.toString())
          localStorage.setItem("walletConnectedAt", new Date().toISOString())

          // Login with backend
          await login(publicKey.toString(), bs58.encode(signature), message)

          // Redirect to dashboard
          router.push("/dashboard")
        } catch (error) {
          console.error("Auto-login failed:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    handleAutoLogin()
  }, [connected, publicKey, signMessage, isConnected, login, router])

  // If using wallet adapter UI
  if (process.env.NEXT_PUBLIC_USE_WALLET_MODAL === "true") {
    return <WalletMultiButton className="!rounded-full !bg-primary hover:!bg-primary/90 !text-primary-foreground !font-semibold !px-8 !h-11" />
  }

  // Custom button for Phantom-only
  const handleConnect = async () => {
    setIsLoading(true)
    try {
      // Check if Phantom is installed
      if (!isPhantomInstalled()) {
        console.warn("Phantom wallet not installed, opening install page")
        window.open("https://phantom.app/", "_blank")
        setIsLoading(false)
        return
      }

      console.log("Attempting to connect to Phantom...")

      // Request connection with proper error handling
      const response = await connectPhantom(false)
      const pubKey = response.publicKey

      console.log("Successfully connected to Phantom:", pubKey)

      // Store wallet address and connection time
      localStorage.setItem("walletAddress", pubKey)
      localStorage.setItem("walletConnectedAt", new Date().toISOString())

      // Sign message for backend auth
      const message = `Sign this message to authenticate with SaloneVest. Timestamp: ${Date.now()}`
      const encodedMessage = new TextEncoder().encode(message)

      console.log("Requesting message signature from Phantom...")

      // Sign message with error handling
      try {
        const signedMessage = await window.phantom?.solana?.signMessage(encodedMessage)
        if (!signedMessage?.signature) {
          throw new Error("No signature returned from Phantom")
        }

        console.log("Successfully signed message")

        // Login with backend
        await login(pubKey, bs58.encode(signedMessage.signature), message)

        console.log("Successfully logged in, redirecting to dashboard...")

        // Redirect to dashboard
        router.push("/dashboard")
      } catch (signError) {
        console.error("Message signing failed:", signError)
        throw new Error(`Failed to sign message: ${(signError as any).message || String(signError)}`)
      }
    } catch (error) {
      const errorMessage = (error as any).message || String(error)
      console.error("Wallet connection failed:", errorMessage)
      
      // Show user-friendly error message
      let userMessage = "Failed to connect wallet"
      if (errorMessage.includes("not installed")) {
        userMessage = "Phantom wallet not installed. Please install it first."
      } else if (errorMessage.includes("rejected")) {
        userMessage = "Connection request was rejected"
      } else if (errorMessage.includes("network")) {
        userMessage = "Network error - please check your connection"
      }
      
      // You could show a toast notification here if you have a toast library
      // toast.error(userMessage)
      console.error("User-friendly message:", userMessage)
      
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (disconnect) {
      await disconnect()
    }
    router.push("/")
  }

  return (
    <div className="flex items-center gap-2">
      {connected && publicKey ? (
        <>
          <span className="text-sm text-muted-foreground hidden md:inline">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="rounded-full font-semibold px-6 h-11"
          >
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-11"
        >
          {isLoading ? "Connecting..." : "Connect Phantom"}
        </Button>
      )}
    </div>
  )
}
