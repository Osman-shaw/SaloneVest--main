'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function DebugPage() {
    const [apiStatus, setApiStatus] = useState<'checking' | 'healthy' | 'error'>('checking')
    const [apiUrl, setApiUrl] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const checkApi = async () => {
            const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
            setApiUrl(url)

            try {
                const response = await fetch(`${url}/health`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })

                if (response.ok) {
                    setApiStatus('healthy')
                    setError(null)
                } else {
                    setApiStatus('error')
                    setError(`API returned status ${response.status}`)
                }
            } catch (err) {
                setApiStatus('error')
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Could not connect to backend'
                )
            }
        }

        checkApi()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 md:py-12">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">System Diagnostics</h1>

                <div className="space-y-4">
                    {/* API Status */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Backend API Status</CardTitle>
                                <Badge
                                    className={
                                        apiStatus === 'healthy'
                                            ? 'bg-green-100 text-green-800'
                                            : apiStatus === 'error'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                    }
                                >
                                    {apiStatus === 'healthy' ? '✅ Online' : apiStatus === 'checking' ? '🔄 Checking...' : '❌ Offline'}
                                </Badge>
                            </div>
                            <CardDescription>API connectivity check</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">API URL:</p>
                                <p className="font-mono text-sm bg-muted p-2 rounded">{apiUrl}</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded p-3">
                                    <p className="text-sm font-medium text-red-800">Error:</p>
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {apiStatus === 'error' && (
                                <div className="bg-blue-50 border border-blue-200 rounded p-3 space-y-2">
                                    <p className="text-sm font-medium text-blue-800">⚠️ Backend Server Not Running</p>
                                    <p className="text-sm text-blue-700">To start the backend:</p>
                                    <div className="bg-slate-900 text-green-400 p-2 rounded font-mono text-xs space-y-1">
                                        <p>cd backend</p>
                                        <p>npm install</p>
                                        <p>npm start</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Environment Variables */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Environment Configuration</CardTitle>
                            <CardDescription>Current environment variables</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm font-medium">NEXT_PUBLIC_API_URL</p>
                                <p className="text-sm text-muted-foreground font-mono">
                                    {process.env.NEXT_PUBLIC_API_URL || 'not set (defaults to http://localhost:5000)'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">NEXT_PUBLIC_SOLANA_RPC_URL</p>
                                <p className="text-sm text-muted-foreground font-mono">
                                    {process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'not set'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">NEXT_PUBLIC_SOLANA_NETWORK</p>
                                <p className="text-sm text-muted-foreground font-mono">
                                    {process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'not set'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Getting Started</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-3 list-decimal list-inside">
                                <li className="text-sm">
                                    <strong>Start Backend Server:</strong> Run <code className="bg-muted px-2 py-1 rounded">npm start</code> in the <code className="bg-muted px-2 py-1 rounded">backend/</code> folder
                                </li>
                                <li className="text-sm">
                                    <strong>Ensure MongoDB is Running:</strong> Verify MongoDB connection at <code className="bg-muted px-2 py-1 rounded">mongodb://localhost:27017/salonevest</code>
                                </li>
                                <li className="text-sm">
                                    <strong>Check Environment Files:</strong> Verify <code className="bg-muted px-2 py-1 rounded">.env.local</code> in frontend and <code className="bg-muted px-2 py-1 rounded">.env</code> in backend
                                </li>
                                <li className="text-sm">
                                    <strong>Refresh Page:</strong> After backend starts, refresh this page to verify connection
                                </li>
                            </ol>
                        </CardContent>
                    </Card>

                    {/* Debug Actions */}
                    {apiStatus === 'error' && (
                        <div className="flex gap-2">
                            <Button
                                onClick={() => window.location.reload()}
                                className="flex-1"
                            >
                                🔄 Retry Connection
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.open('http://localhost:5000/health', '_blank')}
                                className="flex-1"
                            >
                                📊 Test API Directly
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
