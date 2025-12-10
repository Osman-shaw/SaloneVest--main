import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"

// Initialize Solana connection (devnet for testing/development)
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
export const connection = new Connection(RPC_ENDPOINT, "confirmed")

// USDC Mint Address on Solana
export const USDC_MINT = new PublicKey("EPjFWaJgt5WW5vFZmDSK3QE2YU2T3YD5FvYuK8xJSLqg")

// Treasury Wallet Address (where investments are sent)
export const TREASURY_WALLET = new PublicKey("mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2kN") // Valid Devnet address for testing (Updated)

export interface WalletConnection {
  publicKey: PublicKey
  signTransaction?: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>
}

export interface TransactionDetails {
  investmentId: string
  amount: number
  investorAddress: string
  timestamp: number
  txHash?: string
  status: "pending" | "confirmed" | "failed"
}

/**
 * Sign and send investment transaction to Solana blockchain
 */
export async function signInvestmentTransaction(
  wallet: WalletConnection,
  investmentId: string,
  amount: number,
): Promise<{ txHash: string; success: boolean }> {
  try {
    console.log("[Solana] Preparing investment transaction...", { investmentId, amount })

    // Create transaction
    const transaction = new Transaction()

    // Add instruction to transfer SOL to Treasury
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: TREASURY_WALLET,
        lamports: Math.floor(amount * 1e9), // Convert SOL to lamports
      }),
    )

    // Set transaction details
    const blockHash = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockHash.blockhash
    transaction.feePayer = wallet.publicKey

    // Sign transaction with Phantom wallet
    if (!wallet.signTransaction) {
      throw new Error("Wallet does not support transaction signing")
    }

    const signedTransaction = await wallet.signTransaction(transaction)

    console.log("[Solana] Transaction signed, sending to network...")

    // Send transaction
    const txHash = await connection.sendRawTransaction(signedTransaction.serialize())

    // Wait for confirmation
    await connection.confirmTransaction(txHash, "confirmed")

    console.log("[Solana] Transaction confirmed:", txHash)

    // Store transaction locally
    storeTransactionLocally({
      investmentId,
      amount,
      investorAddress: wallet.publicKey.toString(),
      timestamp: Date.now(),
      txHash,
      status: "confirmed",
    })

    return { txHash, success: true }
  } catch (error) {
    console.error("[Solana] Transaction failed:", error)
    return { txHash: "", success: false }
  }
}

import { db } from "./db"

/**
 * Store transaction details in IndexedDB for offline access
 */
export async function storeTransactionLocally(details: TransactionDetails) {
  if (typeof window === "undefined") return

  try {
    await db.addTransaction({
      type: "investment",
      amount: details.amount,
      recipient: "Treasury",
      txHash: details.txHash,
      date: new Date(details.timestamp).toISOString().split('T')[0],
      status: details.status === "confirmed" ? "completed" : "pending",
      synced: details.status === "confirmed" ? 1 : 0
    })
  } catch (error) {
    console.error("Failed to store transaction locally:", error)
  }
}

/**
 * Get stored transactions from IndexedDB
 */
export async function getStoredTransactions(): Promise<TransactionDetails[]> {
  try {
    const records = await db.getTransactions()
    return records.map(r => ({
      investmentId: r.id?.toString() || "0",
      amount: r.amount,
      investorAddress: "", // Not stored in new schema, but not critical for display
      timestamp: new Date(r.date).getTime(),
      txHash: r.txHash,
      status: r.status === "completed" ? "confirmed" : "pending"
    }))
  } catch (error) {
    console.error("Failed to get stored transactions:", error)
    return []
  }
}

/**
 * Get wallet balance in USDC
 */
export async function getUSDCBalance(walletAddress: string): Promise<number> {
  try {
    const pubKey = new PublicKey(walletAddress)
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
      mint: USDC_MINT,
    })

    if (tokenAccounts.value.length === 0) return 0

    const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount
    return balance || 0
  } catch (error) {
    console.error("[Solana] Error fetching balance:", error)
    return 0
  }
}

/**
 * Watch for transaction confirmation
 */
export async function watchTransaction(txHash: string): Promise<boolean> {
  try {
    const maxAttempts = 30
    let attempts = 0

    while (attempts < maxAttempts) {
      const status = await connection.getSignatureStatus(txHash)

      if (status.value?.confirmationStatus === "confirmed" || status.value?.confirmationStatus === "finalized") {
        return true
      }

      if (status.value?.err) {
        return false
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      attempts++
    }

    return false
  } catch (error) {
    console.error("[Solana] Error watching transaction:", error)
    return false
  }
}
