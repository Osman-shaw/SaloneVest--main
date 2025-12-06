"use client"

import { ShieldCheck, Zap, Globe, TrendingUp } from "lucide-react"

const features = [
    {
        name: "Zero Remittance Fees",
        description: "Stop losing 5-10% on transfers. Send USDC to Sierra Leone on Solana for near-zero transaction costs ($0.001).",
        icon: Zap,
    },
    {
        name: "Vetted Local Opportunities",
        description: "Access high-growth investments in Freetown and beyond. We verify every business, real estate project, and fund.",
        icon: ShieldCheck,
    },
    {
        name: "Global Access, Local Impact",
        description: "Invest from anywhere in the diaspora. Your capital directly fuels Sierra Leonean businesses and creates jobs.",
        icon: Globe,
    },
    {
        name: "Transparent Tracking",
        description: "See exactly where your money goes. Blockchain technology provides immutable records of your ownership and returns.",
        icon: TrendingUp,
    },
]

export function Features() {
    return (
        <div id="features" className="py-24 sm:py-32 bg-muted/30">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Why SaloneVest?</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Modern Investment for the Sierra Leonean Diaspora
                    </p>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        We bridge the gap between global capital and local opportunities in Sierra Leone using blockchain technology.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16 group">
                                <dt className="text-base font-semibold leading-7 text-foreground">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
