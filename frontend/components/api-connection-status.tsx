'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

export function ApiConnectionStatus() {
    const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 5000)

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/health`,
                    {
                        method: 'GET',
                        signal: controller.signal,
                    }
                )
                clearTimeout(timeoutId)

                if (response.ok) {
                    setStatus('connected')
                } else {
                    setStatus('disconnected')
                }
            } catch (error) {
                setStatus('disconnected')
            }
        }

        checkConnection()

        // Check every 30 seconds
        const interval = setInterval(checkConnection, 30000)
        return () => clearInterval(interval)
    }, [])

    if (status === 'checking') {
        return (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                🔄 Checking...
            </Badge>
        )
    }

    if (status === 'connected') {
        return (
            <Badge className="bg-green-100 text-green-800 border-green-200">
                ✅ Backend Connected
            </Badge>
        )
    }

    return (
        <Badge className="bg-red-100 text-red-800 border-red-200 cursor-pointer" 
            onClick={() => window.location.href = '/debug'}
            title="Click to view diagnostics">
            ❌ Backend Offline
        </Badge>
    )
}
