"use client"

import { ArrowRight } from "lucide-react"

const steps = [
    {
        id: "01",
        title: "Connect Wallet",
        description: "Link your Phantom or Solflare wallet. No bank account needed.",
    },
    {
        id: "02",
        title: "Choose Investment",
        description: "Browse vetted startups, bonds, and funds. View expected yields and risk profiles.",
    },
    {
        id: "03",
        title: "Track & Earn",
        description: "Monitor your portfolio in real-time. Receive payouts directly in USDC.",
    },
]

export function HowItWorks() {
    return (
        <div className="py-24 sm:py-32 bg-background relative overflow-hidden">
            {/* Background Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-secondary">Simple Process</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Start Investing in Minutes
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Lines (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

                    {steps.map((step) => (
                        <div key={step.id} className="relative flex flex-col items-center text-center p-6 glass-card rounded-2xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-primary text-primary font-bold text-lg mb-6 shadow-sm z-10">
                                {step.id}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
