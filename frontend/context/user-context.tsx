"use client"

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"
import { isAxiosError } from "axios"
import type { UserRecord } from "@/lib/user-types"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import {
    fetchUserProfileForSession,
    invalidateUserProfileCache,
} from "@/lib/fetch-user-profile"
import {
    clearStoredWalletSession,
    getSolanaProvider,
    waitForSolanaWallet,
} from "@/lib/solana-wallet"

function normalizeUser(raw: Record<string, unknown> | null | undefined): UserRecord | null {
    if (!raw) return null
    const wallet =
        (typeof raw.walletAddress === "string" && raw.walletAddress) ||
        (typeof raw.publicKey === "string" && raw.publicKey) ||
        ""
    if (!wallet) return null
    return {
        ...raw,
        publicKey: wallet,
        walletAddress: typeof raw.walletAddress === "string" ? raw.walletAddress : wallet,
        role: raw.role as UserRecord["role"],
        profile: raw.profile as UserRecord["profile"],
        settings: raw.settings as UserRecord["settings"],
        kycStatus: raw.kycStatus as UserRecord["kycStatus"],
    }
}

function isRequestAbortError(e: unknown): boolean {
    if (e && typeof e === "object" && "name" in e && (e as { name: string }).name === "AbortError")
        return true
    if (isAxiosError(e) && (e.code === "ERR_CANCELED" || e.message === "canceled")) return true
    return false
}

interface UserContextType {
    user: UserRecord | null
    isLoading: boolean
    login: (publicKey: string, signature?: string, message?: string) => Promise<void>
    logout: () => void
    updateProfile: (updates: Partial<UserRecord>) => Promise<void>
    isAdmin: boolean
    isStartup: boolean
    kycStatus: "none" | "pending" | "verified" | "rejected"
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserRecord | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const login = useCallback(
        async (publicKey: string, signature?: string, message?: string, options?: { signal?: AbortSignal }) => {
            setIsLoading(true)
            const signal = options?.signal
            try {
                let userData: unknown

                if (signature && message) {
                    invalidateUserProfileCache()
                    const response = await api.auth.connect(publicKey, signature, message)
                    userData = response.data.user
                } else {
                    const response = await fetchUserProfileForSession(publicKey, { signal })
                    if (response.status === 404) {
                        if (process.env.NODE_ENV === "development") {
                            console.log(
                                "User profile not found (first login), will be created on auth"
                            )
                        }
                        return
                    }
                    const payload = response.data as { user?: UserRecord } | UserRecord
                    userData = (payload as { user?: UserRecord })?.user ?? payload
                }

                const normalized = normalizeUser(userData as Record<string, unknown>)
                if (normalized) {
                    setUser(normalized)
                    toast.success("Welcome back!", {
                        description: `Logged in as ${normalized.role ?? "investor"}`,
                    })
                }

                localStorage.setItem("publicKey", publicKey)
                localStorage.setItem("walletConnected", "true")
            } catch (error: unknown) {
                if (isRequestAbortError(error)) {
                    return
                }
                const s = (error as { response?: { status?: number } })?.response?.status
                if (s === undefined || s >= 500) {
                    console.error("Login failed:", error)
                } else if (process.env.NODE_ENV === "development") {
                    console.debug("Login: HTTP", s, (error as { response?: { data?: unknown } })?.response?.data)
                }

                let errorMessage = "Login failed"
                let errorDescription = ""

                const status = (error as { response?: { status?: number } })?.response?.status
                if (status === 404) {
                    errorMessage = "User not found"
                    errorDescription = "Connect your wallet and sign to create an account"
                } else if (status === 401) {
                    errorMessage = "Invalid signature"
                    errorDescription = "The signature verification failed"
                } else if (
                    (error as { code?: string })?.code === "ECONNREFUSED" ||
                    (error as Error)?.message?.includes("connect")
                ) {
                    errorMessage = "Cannot connect to backend"
                    errorDescription = "Is the backend server running? Visit /debug"
                } else if (status === 500) {
                    errorMessage = "Server error"
                    errorDescription = "Check backend logs for details"
                }

                if (errorMessage !== "User not found") {
                    toast.error(errorMessage, { description: errorDescription })
                }
            } finally {
                setIsLoading(false)
            }
        },
        []
    )

    useEffect(() => {
        const ac = new AbortController()
        const run = async () => {
            const storedPublicKey = localStorage.getItem("publicKey")
            const walletConnected = localStorage.getItem("walletConnected")
            if (!storedPublicKey || walletConnected !== "true") {
                setIsLoading(false)
                return
            }
            const ready = await waitForSolanaWallet(12, 100)
            if (ac.signal.aborted) return
            const inPage = getSolanaProvider()?.publicKey?.toString()
            // Locked / not injected yet: do not clear storage and do not fetch (avoids spurious GETs)
            if (!ready || !inPage) {
                setIsLoading(false)
                return
            }
            if (inPage !== storedPublicKey) {
                clearStoredWalletSession()
                invalidateUserProfileCache()
                setIsLoading(false)
                return
            }
            await login(storedPublicKey, undefined, undefined, { signal: ac.signal })
        }
        void run()
        return () => {
            ac.abort()
        }
    }, [login])

    const logout = () => {
        setUser(null)
        invalidateUserProfileCache()
        localStorage.removeItem("publicKey")
        localStorage.removeItem("walletConnected")
        localStorage.removeItem("walletConnectedAt")
        toast.info("Logged out")
    }

    const updateProfile = async (updates: Partial<UserRecord>) => {
        if (!user) return

        try {
            const { profile: p, settings: s, ...rest } = updates as Partial<UserRecord> & Record<string, unknown>
            const profile =
                p !== undefined || Object.keys(rest).length > 0
                    ? { ...user.profile, ...p, ...rest }
                    : user.profile
            const response = await api.user.update(user.publicKey, {
                profile,
                settings: s !== undefined ? { ...user.settings, ...s } : user.settings,
            })
            const payload = response.data as { user?: UserRecord } | UserRecord
            const next = normalizeUser(
                ((payload as { user?: UserRecord })?.user ?? payload) as Record<string, unknown>
            )
            if (next) setUser(next)
            invalidateUserProfileCache()
            toast.success("Profile updated")
        } catch (error) {
            console.error("Update failed:", error)
            toast.error("Update failed")
        }
    }

    const isAdmin = user?.role === "admin"
    const isStartup = user?.role === "startup"
    const kycStatus = user?.kycStatus || "none"

    return (
        <UserContext.Provider
            value={{ user, isLoading, login, logout, updateProfile, isAdmin, isStartup, kycStatus }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
