"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { UserRecord } from "@/lib/db" // Keep UserRecord type for now, or move it to types
import { api } from "@/lib/api-client"
import { toast } from "sonner"

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

    useEffect(() => {
        // Check for existing session
        const storedPublicKey = localStorage.getItem("publicKey")
        if (storedPublicKey) {
            login(storedPublicKey)
        } else {
            setIsLoading(false)
        }
    }, [])

    const login = async (publicKey: string, signature?: string, message?: string) => {
        setIsLoading(true)
        try {
            let userData;

            if (signature && message) {
                // Authenticate with backend
                const response = await api.auth.connect(publicKey, signature, message);
                userData = response.data.user;
            } else {
                // Just fetch profile if already authenticated/connected
                const response = await api.user.get(publicKey);
                userData = response.data;
            }

            if (userData) {
                setUser(userData)
                toast.success("Welcome back!", { description: `Logged in as ${userData.role}` })
            }

            localStorage.setItem("publicKey", publicKey)
            localStorage.setItem("walletConnected", "true")
        } catch (error) {
            console.error("Login failed:", error)
            // Fallback for demo/offline if needed, or just show error
            toast.error("Login failed", { description: "Could not load user profile." })
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("publicKey")
        localStorage.removeItem("walletConnected")
        toast.info("Logged out")
    }

    const updateProfile = async (updates: Partial<UserRecord>) => {
        if (!user) return

        try {
            const response = await api.user.update(user.publicKey, updates)
            setUser(response.data)
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
        <UserContext.Provider value={{ user, isLoading, login, logout, updateProfile, isAdmin, isStartup, kycStatus }}>
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
