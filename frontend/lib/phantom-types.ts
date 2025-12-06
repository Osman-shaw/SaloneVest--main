import type { Transaction, PublicKey } from "@solana/web3.js"

export interface PhantomProvider {
  publicKey: PublicKey | null
  isConnected: boolean
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array; publicKey: PublicKey }>
  connect(): Promise<{ publicKey: PublicKey }>
  disconnect(): Promise<void>
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider
    }
  }
}
