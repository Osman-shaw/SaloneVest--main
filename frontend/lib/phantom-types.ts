import type { Transaction, PublicKey } from "@solana/web3.js"

export interface PhantomProvider {
  publicKey: PublicKey | null
  isConnected: boolean
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array; publicKey: PublicKey }>
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PublicKey }>
  disconnect(): Promise<void>
  request(method: string, params?: Record<string, unknown>): Promise<unknown>
}

export interface PhantomConnectionError extends Error {
  code?: number
  message: string
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider
      isPhantom?: boolean
    }
  }
}

// Helper to check if Phantom is available and ready
export const isPhantomInstalled = (): boolean => {
  return typeof window !== "undefined" && !!window.phantom?.solana
}

// Helper to safely connect to Phantom
export const connectPhantom = async (onlyIfTrusted: boolean = false): Promise<{ publicKey: string }> => {
  if (!isPhantomInstalled()) {
    throw new Error("Phantom wallet not installed")
  }

  try {
    const response = await window.phantom?.solana?.connect({ onlyIfTrusted })
    if (response?.publicKey) {
      return { publicKey: response.publicKey.toString() }
    }
    throw new Error("No public key returned from Phantom")
  } catch (error) {
    const err = error as any
    
    // Handle specific Phantom errors
    if (err.code === 4001) {
      throw new Error("User rejected the connection request")
    }
    if (err.code === 4100) {
      throw new Error("Phantom is not authorized to connect")
    }
    if (err.message?.includes("network")) {
      throw new Error("Network error - please check your internet connection")
    }
    
    throw new Error(`Phantom connection failed: ${err.message || String(error)}`)
  }
}
