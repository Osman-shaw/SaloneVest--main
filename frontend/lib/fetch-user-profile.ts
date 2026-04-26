import { api } from "@/lib/api-client"
import type { AxiosResponse } from "axios"

/** Same wallet session: avoid re-hitting GET /api/user on every navigation or focus. */
const CACHE_TTL_MS = 5 * 60 * 1000

const inflight = new Map<string, Promise<AxiosResponse<unknown>>>()

let lastCache: {
  key: string
  at: number
  response: AxiosResponse<unknown>
} | null = null

/**
 * Deduplicate concurrent requests, short-lived cache, optional AbortSignal.
 * Used for session restore to avoid React Strict Mode + remount request storms.
 */
export function fetchUserProfileForSession(
  publicKey: string,
  opts?: { signal?: AbortSignal; bypassCache?: boolean }
): Promise<AxiosResponse<unknown>> {
  if (opts?.signal?.aborted) {
    return Promise.reject(new DOMException("Aborted", "AbortError"))
  }

  if (!opts?.bypassCache && lastCache) {
    const fresh = Date.now() - lastCache.at < CACHE_TTL_MS
    if (fresh && lastCache.key === publicKey) {
      return Promise.resolve(lastCache.response)
    }
  }

  const existing = inflight.get(publicKey)
  if (existing) return existing

  const p = api.user
    .get(publicKey, { signal: opts?.signal })
    .then((res) => {
      lastCache = { key: publicKey, at: Date.now(), response: res }
      return res
    })
    .finally(() => inflight.delete(publicKey))
  inflight.set(publicKey, p)
  return p
}

export function invalidateUserProfileCache() {
  lastCache = null
}
