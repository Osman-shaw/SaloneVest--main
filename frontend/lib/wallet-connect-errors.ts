/**
 * Phantom and other Solana wallets use different shapes; many "connection failed"
 * toasts are really user-dismissed popups or locked wallet.
 */
export function isWalletConnectUserCancelled(err: unknown): boolean {
  if (err == null) return false
  if (typeof err === "object") {
    const o = err as { code?: number; message?: string; name?: string }
    if (o.code === 4001 || o.code === 4100) return true
    const m = (o.message ?? o.name ?? "").toLowerCase()
    if (
      m.includes("user rejected") ||
      m.includes("user denied") ||
      m.includes("rejected the request") ||
      (m.includes("reject") && m.includes("user"))
    ) {
      return true
    }
    // Phantom often surfaces dismiss / close as a generic message
    if (m.includes("unexpected error")) return true
    if (m.includes("cancel") || m.includes("closed") || m.includes("dismiss")) return true
  }
  if (typeof err === "string") {
    const m = err.toLowerCase()
    if (m.includes("unexpected error")) return true
  }
  return false
}
