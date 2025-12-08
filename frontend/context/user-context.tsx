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
        const walletConnected = localStorage.getItem("walletConnected")
        
        // Only try to restore session if wallet was previously connected
        if (storedPublicKey && walletConnected === "true") {
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
                // Authenticate with backend using signature
                const response = await api.auth.connect(publicKey, signature, message);
                userData = response.data.user;
            } else {
                // Try to fetch existing profile without signature
                try {
                    const response = await api.user.get(publicKey);
                    userData = response.data.user || response.data;
                } catch (fetchError: any) {
                    // User doesn't exist yet - this is OK, they'll be created on first auth
                    console.log("User profile not found (first login), will be created on auth")
                    setIsLoading(false)
                    return
                }
            }

            if (userData) {
                setUser(userData)
                toast.success("Welcome back!", { description: `Logged in as ${userData.role}` })
            }

            localStorage.setItem("publicKey", publicKey)
            localStorage.setItem("walletConnected", "true")
        } catch (error: any) {
            console.error("Login failed:", error)
            
            // Provide helpful error messages based on error type
            let errorMessage = "Login failed"
            let errorDescription = ""

            if (error.response?.status === 404) {
                errorMessage = "User not found"
                errorDescription = "Connect your wallet and sign to create an account"
            } else if (error.response?.status === 401) {
                errorMessage = "Invalid signature"
                errorDescription = "The signature verification failed"
            } else if (error.code === 'ECONNREFUSED' || error.message?.includes('connect')) {
                errorMessage = "Cannot connect to backend"
                errorDescription = "Is the backend server running? Visit /debug"
            } else if (error.response?.status === 500) {
                errorMessage = "Server error"
                errorDescription = "Check backend logs for details"
            }

            if (errorMessage !== "User not found") {
                toast.error(errorMessage, { description: errorDescription })
            }
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
