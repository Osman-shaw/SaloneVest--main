"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { AlertCircle, BookOpen } from "lucide-react"

export default function LegalPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeSection, setActiveSection] = useState<"tos" | "risk" | "faq">("faq")

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
          <Button
            variant={activeSection === "faq" ? "default" : "ghost"}
            onClick={() => setActiveSection("faq")}
            className="rounded-b-none px-3 md:px-4 h-10 text-sm md:text-base"
          >
            FAQ
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

        {/* FAQ Section */}
        {activeSection === "faq" && (
          <div className="space-y-6 md:space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
              <p className="text-base md:text-lg text-muted-foreground">Find answers to common questions about SaloneVest</p>

              <div className="space-y-6 text-sm md:text-base">
                {/* Getting Started */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground border-b pb-2">Getting Started</h3>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">What is SaloneVest?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      SaloneVest is a blockchain-powered investment platform that enables diaspora investors to fund vetted Sierra Leonean opportunities using USDC stablecoin on the Solana blockchain. We eliminate traditional remittance fees and provide complete transparency through blockchain technology.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">How do I get started?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      1. Install the Phantom wallet browser extension<br />
                      2. Create a new wallet or import an existing one<br />
                      3. Click "Connect Phantom" on SaloneVest<br />
                      4. Browse available investment opportunities<br />
                      5. Make your first investment with USDC
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Do I need cryptocurrency experience?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      No! While basic familiarity with wallets is helpful, our platform is designed to be user-friendly for everyone. We provide step-by-step guides and support to help you get started.
                    </p>
                  </div>
                </div>

                {/* Wallet & Security */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground border-b pb-2">Wallet & Security</h3>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">What is Phantom Wallet?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Phantom is a secure, non-custodial wallet for Solana blockchain. It's a browser extension that allows you to manage your digital assets and interact with blockchain applications like SaloneVest.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Is my money safe?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      SaloneVest is non-custodial, meaning you maintain complete control of your private keys and funds. We never have access to your wallet or assets. Your security depends on keeping your seed phrase safe and secure.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">What if I lose my seed phrase?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Unfortunately, if you lose your seed phrase, your funds cannot be recovered. This is the nature of non-custodial wallets - no one, including SaloneVest, can access your wallet without your seed phrase. Always store it securely offline.
                    </p>
                  </div>
                </div>

                {/* Investments */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground border-b pb-2">Investments</h3>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">What can I invest in?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      You can invest in vetted Sierra Leonean startups, bonds, index funds, and real estate projects. All opportunities are carefully screened and categorized by risk level (Low, Moderate, High).
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">What is the minimum investment?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Minimum investments vary by opportunity, typically ranging from $100 to $1,000 USDC. Each investment listing shows its specific minimum requirement.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">How are investments vetted?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Our team conducts thorough due diligence including financial analysis, background checks, business plan review, and market assessment. Only opportunities meeting our strict criteria are listed on the platform.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Can I sell my investments?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Liquidity varies by investment type. Some investments have lock-up periods, while others may offer secondary market trading (coming soon). Always review the specific terms before investing.
                    </p>
                  </div>
                </div>

                {/* Fees & Payments */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground border-b pb-2">Fees & Payments</h3>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">What fees do you charge?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Blockchain transaction fees are typically less than $0.001 per transaction. Traditional remittance fees (7-10%) are eliminated. Some investments may have management fees - these are clearly disclosed before you invest.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">What is USDC?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      USDC is a stablecoin pegged 1:1 to the US Dollar. It provides the stability of USD while leveraging blockchain technology for fast, low-cost transactions. You can buy USDC on major cryptocurrency exchanges.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">How do I get USDC?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      You can purchase USDC on cryptocurrency exchanges like Coinbase, Binance, or Kraken, then transfer it to your Phantom wallet. We also provide on-ramp services for direct purchase (coming soon).
                    </p>
                  </div>
                </div>

                {/* Returns & Dividends */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground border-b pb-2">Returns & Dividends</h3>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">When do I receive returns?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Return schedules vary by investment type. Bonds may pay quarterly interest, startups may provide returns upon exit events, and index funds may distribute dividends annually. Each investment specifies its return schedule.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Are returns guaranteed?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      No. All investments carry risk, and returns are never guaranteed. Past performance does not indicate future results. Only invest money you can afford to lose.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">How are dividends paid?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Dividends are automatically distributed to your wallet in USDC via smart contracts. You'll receive notifications when dividends are paid, and they'll appear in your portfolio balance.
                    </p>
                  </div>
                </div>

                {/* Technical */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground border-b pb-2">Technical Questions</h3>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Why Solana blockchain?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Solana offers fast transaction speeds (400ms), extremely low fees ($0.00025 average), and high scalability. This makes it ideal for financial applications requiring frequent transactions.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">What are smart contracts?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Smart contracts are self-executing programs on the blockchain that automatically enforce investment terms. They ensure transparency, eliminate intermediaries, and reduce the risk of fraud.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Is the platform audited?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Yes, our smart contracts undergo regular security audits by reputable third-party firms. Audit reports are available upon request.
                    </p>
                  </div>
                </div>

                {/* Support */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground border-b pb-2">Support</h3>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">How do I contact support?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Email us at support@salonevest.io or join our Discord community for real-time assistance. We typically respond within 24 hours.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Is there a mobile app?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Currently, SaloneVest is a web application optimized for mobile browsers. A dedicated mobile app is planned for future release.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-foreground">Can I invest from any country?</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      SaloneVest is available globally, but some jurisdictions may have restrictions. Please ensure cryptocurrency investments are legal in your country before using our platform.
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
                  <p className="text-green-900 dark:text-green-200 text-sm md:text-base">
                    <span className="font-semibold">Still have questions?</span> Contact our support team at support@salonevest.io or join our Discord community for assistance.
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
