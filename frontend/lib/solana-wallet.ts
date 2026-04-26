import type { PhantomProvider } from "@/lib/phantom-types"

export function getSolanaProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null
  const w = window as Window & {
    solana?: PhantomProvider
    phantom?: { solana?: PhantomProvider }
  }
  return w.phantom?.solana ?? w.solana ?? null
}

/** True when the in-page wallet (Phantom) reports connected with a public key. */
export function isSolanaWalletReady(): boolean {
  const p = getSolanaProvider()
  return Boolean(p?.isConnected && p?.publicKey)
}

/** Wait for the extension to inject the provider; avoids a false redirect on first paint. */
export async function waitForSolanaWallet(
  maxAttempts = 12,
  delayMs = 100
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    if (isSolanaWalletReady()) return true
    await new Promise((r) => setTimeout(r, delayMs))
  }
  return isSolanaWalletReady()
}

export function clearStoredWalletSession() {
  try {
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("publicKey")
    localStorage.removeItem("walletConnectedAt")
  } catch {
    /* ignore */
  }
}

export function syncStoredWalletFromProvider(): void {
  const p = getSolanaProvider()
  if (!p?.isConnected || !p.publicKey) return
  try {
    const pk = p.publicKey.toString()
    localStorage.setItem("publicKey", pk)
    localStorage.setItem("walletConnected", "true")
    localStorage.setItem("walletConnectedAt", new Date().toISOString())
  } catch {
    /* ignore */
  }
}
