"use client"

import { useOffline } from "@/hooks/use-offline"

export function OfflineIndicator() {
  const { isOnline } = useOffline()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg z-40">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
        </div>
        <div>
          <p className="font-semibold text-yellow-900 dark:text-yellow-200 text-sm">You're offline</p>
          <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1">
            Your transactions and portfolio data are synced locally. Changes will be sent when you reconnect.
          </p>
        </div>
      </div>
    </div>
  )
}
