"use client"

import { useEffect, useState } from "react"
import { useOffline } from "@/hooks/use-offline"
import { db } from "@/lib/db"
import { toast } from "sonner"
import { Loader2, Wifi, WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline } = useOffline()
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  // Check for pending transactions when coming back online
  useEffect(() => {
    if (isOnline) {
      checkPendingSync()
    }
  }, [isOnline])

  const checkPendingSync = async () => {
    try {
      const pending = await db.getPendingTransactions()
      setPendingCount(pending.length)

      if (pending.length > 0) {
        syncTransactions(pending)
      }
    } catch (error) {
      console.error("Error checking pending sync:", error)
    }
  }

  const syncTransactions = async (transactions: any[]) => {
    setIsSyncing(true)
    toast.info("Syncing offline transactions...", {
      description: `Processing ${transactions.length} pending actions.`
    })

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mark all as synced for this demo
    for (const tx of transactions) {
      await db.markAsSynced(tx.id, "synced-offline-tx-" + Date.now())
    }

    setIsSyncing(false)
    setPendingCount(0)
    toast.success("Sync Complete", {
      description: "All offline transactions have been processed."
    })
  }

  if (isOnline && !isSyncing) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background border rounded-lg p-4 shadow-lg z-50 animate-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${isOnline ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
          {isOnline ? (
            isSyncing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wifi className="h-5 w-5" />
          ) : (
            <WifiOff className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">
            {isOnline ? (isSyncing ? "Syncing Data..." : "Back Online") : "You're Offline"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isOnline
              ? "Synchronizing your offline changes with the blockchain."
              : "Changes are saved locally and will sync when you reconnect."}
          </p>
        </div>
      </div>
    </div>
  )
}
