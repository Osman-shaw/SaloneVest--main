"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useUser } from "@/context/user-context"
import { getSolanaProvider, syncStoredWalletFromProvider } from "@/lib/solana-wallet"
import { isWalletConnectUserCancelled } from "@/lib/wallet-connect-errors"

export function WalletConnect({ isConnected = false }: { isConnected?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useUser()

  const handlePhantomConnect = async () => {
    const provider = getSolanaProvider()
    if (!provider || typeof provider.connect !== "function") {
      window.open("https://phantom.app/", "_blank")
      toast.error("Install Phantom", {
        description: "Add the Phantom browser extension, then try again.",
      })
      return
    }

    setIsLoading(true)
    try {
      let publicKey = provider.isConnected && provider.publicKey ? provider.publicKey : null

      if (!publicKey) {
        const out = await provider.connect.call(provider, { onlyIfTrusted: false })
        publicKey = out?.publicKey ?? provider.publicKey ?? null
      }

      if (!publicKey) {
        throw new Error("Wallet did not return a public key")
      }

      const pk = publicKey.toString()
      syncStoredWalletFromProvider()
      await login(pk)
      router.replace("/dashboard")
    } catch (err) {
      if (isWalletConnectUserCancelled(err)) {
        if (process.env.NODE_ENV === "development") {
          console.debug("Wallet connect cancelled or dismissed", err)
        }
        return
      }
      toast.error("Could not open Phantom", {
        description: "Unlock the extension, approve this site, then try again.",
      })
      if (process.env.NODE_ENV === "development") {
        console.debug("Wallet connect error:", err)
      }
    } finally {
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
