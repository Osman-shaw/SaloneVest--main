/** Embedded checkout script (CORS: set baseUrl to api host). */
export const PEEAP_SCRIPT_SRC = "https://checkout.peeap.com/embed/peeap-sdk.js" as const

export function getPeeapPublicKey(): string | undefined {
  const k = process.env.NEXT_PUBLIC_PEEAP_PUBLIC_KEY?.trim()
  return k || undefined
}

export function getPeeapBaseUrl(): string {
  return process.env.NEXT_PUBLIC_PEEAP_BASE_URL?.trim() || "https://api.peeap.com"
}

/** Shown in UI: approximate SLE per 1 USDC (must match backend SLE_USDC_RATE). */
export function getDisplaySlePerUsdc(): number {
  const n = parseFloat(process.env.NEXT_PUBLIC_SLE_USDC_RATE || "25")
  return Number.isFinite(n) && n > 0 ? n : 25
}
