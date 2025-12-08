"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react"

interface EndpointTest {
  name: string
  endpoint: string
  method: "GET" | "POST"
  status: "idle" | "testing" | "success" | "failed"
  message?: string
  responseTime?: number
}

export default function DiagnosticsPage() {
  const [baseUrl, setBaseUrl] = useState("http://localhost:5000")
  const [endpoints, setEndpoints] = useState<EndpointTest[]>([
    {
      name: "Health Check",
      endpoint: "/health",
      method: "GET",
      status: "idle"
    },
    {
      name: "Auth Connect",
      endpoint: "/api/auth/connect",
      method: "POST",
      status: "idle"
    },
    {
      name: "Get Investments",
      endpoint: "/api/investments",
      method: "GET",
      status: "idle"
    },
    {
      name: "Get User",
      endpoint: "/api/user/test-wallet",
      method: "GET",
      status: "idle"
    },
    {
      name: "Get Portfolio",
      endpoint: "/api/portfolio/test-wallet",
      method: "GET",
      status: "idle"
    },
    {
      name: "Get Balance",
      endpoint: "/api/balance/test-wallet",
      method: "GET",
      status: "idle"
    }
  ])

  const [backendRunning, setBackendRunning] = useState<boolean | null>(null)
  const [frontendUrl, setFrontendUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")

  // Test single endpoint
  const testEndpoint = async (index: number) => {
    const endpoint = endpoints[index]
    const newEndpoints = [...endpoints]
    newEndpoints[index].status = "testing"
    setEndpoints(newEndpoints)

    try {
      const startTime = Date.now()
      const url = `${baseUrl}${endpoint.endpoint}`

      const config: RequestInit = {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json"
        }
      }

      // Add dummy data for POST requests
      if (endpoint.method === "POST") {
        config.body = JSON.stringify({
          publicKey: "test-key",
          signature: "test-sig",
          message: "test-message"
        })
      }

      const response = await fetch(url, config)
      const responseTime = Date.now() - startTime

      newEndpoints[index].status = "success"
      newEndpoints[index].responseTime = responseTime
      newEndpoints[index].message = `Status: ${response.status} ${response.statusText}`
    } catch (error: any) {
      newEndpoints[index].status = "failed"
      newEndpoints[index].message = error.message || "Connection failed"
    }

    setEndpoints(newEndpoints)
  }

  // Test backend connectivity
  const testBackend = async () => {
    try {
      const response = await fetch(`${baseUrl}/health`)
      if (response.ok) {
        setBackendRunning(true)
      } else {
        setBackendRunning(false)
      }
    } catch {
      setBackendRunning(false)
    }
  }

  // Test all endpoints
  const testAllEndpoints = async () => {
    for (let i = 0; i < endpoints.length; i++) {
      await testEndpoint(i)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  useEffect(() => {
    testBackend()
  }, [baseUrl])

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">🔧 API Diagnostics</h1>
          <p className="text-muted-foreground">
            Debug backend connectivity and endpoint issues
          </p>
        </div>

        {/* Backend Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Backend Status</span>
              {backendRunning === null ? (
                <Clock className="h-5 w-5 text-yellow-600 animate-spin" />
              ) : backendRunning ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Backend URL</label>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md bg-background"
                  placeholder="http://localhost:5000"
                />
                <Button onClick={testBackend}>Test</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Status:</p>
              {backendRunning === null ? (
                <Badge variant="outline" className="bg-yellow-50">⏳ Testing...</Badge>
              ) : backendRunning ? (
                <Badge className="bg-green-50 text-green-700">
                  ✅ Backend Running
                </Badge>
              ) : (
                <Badge className="bg-red-50 text-red-700">
                  ❌ Backend Not Running
                </Badge>
              )}
            </div>

            {!backendRunning && backendRunning !== null && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm">
                <p className="font-medium text-red-900 dark:text-red-200 mb-1">
                  Backend is not running!
                </p>
                <p className="text-red-800 dark:text-red-300 text-xs">
                  To start the backend, run:
                </p>
                <code className="block bg-red-100 dark:bg-red-900/50 p-2 rounded mt-1 text-xs font-mono">
                  cd backend && npm run dev
                </code>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frontend URL:</span>
              <code className="bg-muted px-2 py-1 rounded">{typeof window !== "undefined" ? window.location.origin : "N/A"}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Backend URL:</span>
              <code className="bg-muted px-2 py-1 rounded">{baseUrl}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">NEXT_PUBLIC_API_URL:</span>
              <code className="bg-muted px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL || "Not set"}</code>
            </div>
          </CardContent>
        </Card>

        {/* Endpoint Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Endpoint Tests</span>
              <Button onClick={testAllEndpoints} size="sm">
                Test All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{endpoint.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {endpoint.method} {endpoint.endpoint}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {endpoint.responseTime && (
                      <span className="text-xs text-muted-foreground">
                        {endpoint.responseTime}ms
                      </span>
                    )}
                    {endpoint.status === "idle" && (
                      <Button
                        onClick={() => testEndpoint(index)}
                        size="sm"
                        variant="outline"
                      >
                        Test
                      </Button>
                    )}
                    {endpoint.status === "testing" && (
                      <Clock className="h-4 w-4 text-yellow-600 animate-spin" />
                    )}
                    {endpoint.status === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    {endpoint.status === "failed" && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting Guide */}
        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Troubleshooting Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">❌ 404 Error: Endpoint not found</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                <li>Check if backend is running: `npm run dev` in /backend</li>
                <li>Verify endpoint exists in backend routes</li>
                <li>Check route mounting in backend/src/server.ts</li>
                <li>Ensure correct method (GET/POST) is used</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">❌ Connection Refused</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                <li>Start backend: `cd backend && npm run dev`</li>
                <li>Check backend is listening on correct port (default: 5000)</li>
                <li>Verify NEXT_PUBLIC_API_URL environment variable</li>
                <li>Check firewall/network settings</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">❌ 500 Server Error</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                <li>Check backend console for error messages</li>
                <li>Verify database connection (MongoDB)</li>
                <li>Check request body format matches API requirements</li>
                <li>Review error logs in backend terminal</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">✅ Quick Start Commands</h4>
              <code className="block bg-background p-2 rounded text-xs font-mono space-y-1">
                <div># Terminal 1: Start Backend</div>
                <div>cd backend && npm run dev</div>
                <br />
                <div># Terminal 2: Start Frontend</div>
                <div>cd frontend && npm run dev</div>
                <br />
                <div># Then visit: http://localhost:3000</div>
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Test Login */}
        <Card>
          <CardHeader>
            <CardTitle>Test Login Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              To test the login flow, you need:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Phantom wallet extension installed</li>
              <li>Solana Devnet selected in Phantom</li>
              <li>Backend running and health check passing</li>
              <li>Click "Connect Phantom" in the top-right navbar</li>
            </ol>
            <Button className="w-full" onClick={() => window.location.href = "/"}>
              Go to Home Page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
