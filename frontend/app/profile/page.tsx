"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ProfileManagement } from "@/components/profile-management"

export default function ProfilePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const walletConnected = localStorage.getItem("walletConnected") === "true"
    if (!walletConnected) {
      router.push("/")
    } else {
      setIsConnected(true)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border border-t-primary" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar isConnected={isConnected} />
      <ProfileManagement />
    </main>
  )
}
