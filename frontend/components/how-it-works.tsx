"use client"

import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const steps = [
    {
        id: "01",
        title: "Connect Wallet",
        description: "Securely connect your Phantom wallet. No bank account required—just your non-custodial digital wallet.",
        action: "connect",
    },
    {
        id: "02",
        title: "Discover",
        description: "Browse vetted high-growth startups and real estate projects in Sierra Leone. Filter by risk, yield, and impact.",
        action: "navigate",
        path: "/dashboard",
    },
    {
        id: "03",
        title: "Invest",
        description: "Invest instantly using USDC. Smart contracts ensure transparency and automate your ownership records.",
        action: "navigate",
        path: "/dashboard",
    },
    {
        id: "04",
        title: "Track & Earn",
        description: "Monitor your portfolio performance in real-time and receive returns directly to your wallet.",
        action: "navigate",
        path: "/portfolio",
    },
]

export function HowItWorks() {
    const router = useRouter()
    const [isConnecting, setIsConnecting] = useState(false)

    const handleStepClick = async (step: typeof steps[0]) => {
        if (step.action === "connect") {
            setIsConnecting(true)
            try {
                // Check if Phantom is installed
                // Check if Phantom is installed
                const provider = window.phantom?.solana

                if (!provider) {
                    // If on mobile, try to open in Phantom browser
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

                    if (isMobile) {
                        const currentUrl = encodeURIComponent(window.location.href)
                        const ref = encodeURIComponent(window.location.origin)
                        window.location.href = `https://phantom.app/ul/browse/${currentUrl}?ref=${ref}`
                    } else {
                        window.open("https://phantom.app/", "_blank")
                    }

                    setIsConnecting(false)
                    return
                }

                // Request connection
                const response = await window.phantom?.solana?.connect()

                if (response?.publicKey) {
                    // Store wallet connection
                    localStorage.setItem("walletConnected", "true")
                    localStorage.setItem("publicKey", response.publicKey.toString())

                    // Refresh to update UI state
                    window.location.reload()
                }
            } catch (error) {
                console.error("Wallet connection failed:", error)
            } finally {
                setIsConnecting(false)
            }
        } else if (step.action === "navigate" && step.path) {
            router.push(step.path)
        }
    }

    return (
        <div id="how-it-works" className="py-24 sm:py-32 bg-background relative overflow-hidden">
            {/* Background Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-secondary">Simple Process</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Start Investing in Minutes
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting Lines (Desktop) - Adjusted for 4 columns */}
                    <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

                    {steps.map((step) => (
                        <div
                            key={step.id}
                            onClick={() => handleStepClick(step)}
                            className="relative flex flex-col items-center text-center p-6 glass-card rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-lg group"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-primary text-primary font-bold text-lg mb-6 shadow-sm z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                {step.id}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                            {step.action === "connect" && isConnecting && (
                                <p className="text-xs text-primary mt-2 animate-pulse">Connecting...</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
