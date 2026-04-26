import type { Transaction, PublicKey } from "@solana/web3.js"

/** Phantom and most Solana wallets; `isPhantom` is optional for generic injected wallets. */
export interface PhantomProvider {
  isPhantom?: boolean
  publicKey: PublicKey | null
  isConnected: boolean
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array; publicKey: PublicKey }>
  connect(
    options?: { onlyIfTrusted?: boolean }
  ): Promise<{ publicKey: PublicKey } | undefined>
  disconnect(): Promise<void>
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider
    }
  }
}
