"use client"

import { useState, useEffect } from "react"
import type { PublicKey, Transaction } from "@solana/web3.js"
import type { PhantomProvider } from "@/lib/phantom-types"

export function useWallet() {
  const [wallet, setWallet] = useState<PhantomProvider | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPhantom = () => {
      const phantom = window.phantom?.solana

      if (phantom) {
        setWallet(phantom)

        if (phantom.isConnected && phantom.publicKey) {
          setIsConnected(true)
          setPublicKey(phantom.publicKey)
        }
      }

      setIsLoading(false)
    }

    // Check immediately if document is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", checkPhantom)
      return () => document.removeEventListener("DOMContentLoaded", checkPhantom)
    } else {
      checkPhantom()
    }
  }, [])

  const connect = async () => {
    if (!wallet) {
      window.open("https://phantom.app/", "_blank")
      return
    }

    try {
      const result = await wallet.connect()
      setIsConnected(true)
      setPublicKey(result.publicKey)
      return result.publicKey
    } catch (error) {
      console.error("Connection failed:", error)
      throw error
    }
  }

  const disconnect = async () => {
    if (wallet) {
      await wallet.disconnect()
      setIsConnected(false)
      setPublicKey(null)
    }
  }

  const signTransaction = async (transaction: Transaction) => {
    if (!wallet || !isConnected) {
      throw new Error("Wallet not connected")
    }
    return wallet.signTransaction(transaction)
  }

  return {
    wallet,
    isConnected,
    publicKey,
    isLoading,
    connect,
    disconnect,
    signTransaction,
  }
}
