"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { AlertCircle, BookOpen } from "lucide-react"

export default function LegalPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeSection, setActiveSection] = useState<"tos" | "risk">("tos")

  useEffect(() => {
    const walletConnected = localStorage.getItem("walletConnected") === "true"
    setIsConnected(walletConnected)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Navbar isConnected={isConnected} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="space-y-4 mb-8 md:mb-12">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Legal & Compliance</h1>
          </div>
          <p className="text-base md:text-lg text-muted-foreground">Last updated: December 2024</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-border">
          <Button
            variant={activeSection === "tos" ? "default" : "ghost"}
            onClick={() => setActiveSection("tos")}
            className="rounded-b-none px-3 md:px-4 h-10 text-sm md:text-base"
          >
            Terms of Service
          </Button>
          <Button
            variant={activeSection === "risk" ? "default" : "ghost"}
            onClick={() => setActiveSection("risk")}
            className="rounded-b-none px-3 md:px-4 h-10 text-sm md:text-base"
          >
            Risk Disclosure
          </Button>
        </div>

        {/* Terms of Service */}
        {activeSection === "tos" && (
          <div className="space-y-6 md:space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Terms of Service</h2>
              <div className="space-y-6 text-sm md:text-base">
                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">1. Acceptance of Terms</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using SaloneVest, you accept and agree to be bound by the terms and provision of
                    this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">2. Use License</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Permission is granted to temporarily download one copy of the materials (information or software) on
                    SaloneVest for personal, non-commercial transitory viewing only.
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on SaloneVest</li>
                    <li>Remove any copyright or other proprietary notations</li>
                    <li>Transfer the materials to another person or mirror the materials on any other server</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">3. Wallet and Self-Custody</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    SaloneVest is a non-custodial platform. You maintain complete control of your private keys and
                    digital assets. We cannot recover lost, forgotten, or compromised private keys.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">4. Investment Risks</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All investments carry risk. Past performance does not guarantee future results. Investments in
                    startups, emerging markets, and alternative assets are particularly risky.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">5. Limitation of Liability</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    In no event shall SaloneVest or its suppliers be liable for any damages arising out of the use or
                    inability to use the materials on SaloneVest.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">6. Governing Law</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with the laws of Sierra
                    Leone.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Risk Disclosure */}
        {activeSection === "risk" && (
          <div className="space-y-6 md:space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Risk Disclosure Statement</h2>
              <p className="text-base md:text-lg text-muted-foreground">Important Information for Investors</p>

              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-orange-900 dark:text-orange-200 font-semibold text-sm md:text-base">
                  Warning: Investing involves risk of loss. Past performance does not guarantee future results.
                </p>
              </div>

              <div className="space-y-6 text-sm md:text-base">
                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">1. Cryptocurrency Risk</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    USDC, while a stablecoin pegged to the US Dollar, is still a digital asset subject to market
                    conditions.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">2. Emerging Market Risk</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Sierra Leone is an emerging market with unique political, economic, and regulatory risks.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">3. Startup Investment Risk</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Investments in startups carry substantially higher risk of loss. Many startups fail, resulting in
                    total loss of invested capital.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">4. Liquidity Risk</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Investments may not be liquid. You may not be able to sell investments quickly or at favorable
                    prices.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">5. Currency Risk</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    While we invest in USDC to minimize currency risk, conversion may incur slippage during volatility.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">6. Regulatory Risk</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Cryptocurrency regulations are evolving globally. Changes could adversely affect your investments.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold text-foreground">7. Smart Contract Risk</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    While our Solana programs are audited, there remains the possibility of security vulnerabilities.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3 mt-6">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-900 dark:text-blue-200 text-sm md:text-base">
                    <span className="font-semibold">Acknowledgment:</span> By proceeding with investments, you
                    acknowledge that you understand these risks and are investing only money you can afford to lose.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  )
}
