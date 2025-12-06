"use client"
import { Button } from "@/components/ui/button"
import { WalletConnect } from "./wallet-connect"
import { ArrowRight, TrendingUp } from "lucide-react"

import { useRouter } from "next/navigation"

interface HeroProps {
  onConnect: () => void
}

export function Hero({ onConnect }: HeroProps) {
  const router = useRouter()

  return (
    <section className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden bg-background flex items-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-secondary/10 border border-secondary/20 px-4 py-1.5 backdrop-blur-sm mx-auto lg:mx-0">
                <span className="flex h-2 w-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
                <span className="text-xs font-semibold text-secondary-foreground tracking-wide uppercase">Diaspora Investment Platform</span>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Invest in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sierra Leone</span> <br className="hidden lg:block" />
                Without Limits
              </h1>
            </div>

            <p className="max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Fund local startups, bonds, and mutual funds using USDC on Solana.
              Zero remittance fees. Full transparency. Real impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <div className="scale-110">
                <WalletConnect isConnected={false} />
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="rounded-full px-8 h-11 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
              >
                Explore Opportunities <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">0%</div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Remittance Fees</p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">$100+</div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Min Investment</p>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground">24/7</div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Liquidity</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Glassmorphism Card Stack */}
          <div className="relative hidden lg:block h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center animate-float">
              {/* Main Card */}
              <div className="relative w-96 z-20">
                <div className="glass-card rounded-3xl p-6 border border-white/20">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Portfolio</p>
                      <h3 className="text-3xl font-bold text-foreground mt-1">$12,450.00</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">SL</div>
                        <div>
                          <p className="font-medium text-sm">Gov. Bond Series A</p>
                          <p className="text-xs text-muted-foreground">Fixed Income</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">$5,000</p>
                        <p className="text-xs text-green-500">+12%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">Ag</div>
                        <div>
                          <p className="font-medium text-sm">Freetown Agro</p>
                          <p className="text-xs text-muted-foreground">Startup Equity</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">$2,500</p>
                        <p className="text-xs text-green-500">+45%</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Yield</span>
                      <span className="font-bold text-primary">+$342.50 (2.8%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 -right-12 z-10 animate-float" style={{ animationDelay: '1s' }}>
                <div className="glass-card p-4 rounded-2xl w-48">
                  <p className="text-xs text-muted-foreground mb-1">New Opportunity</p>
                  <p className="font-bold text-sm mb-2">Solar Grid Expansion</p>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-accent w-3/4 h-1.5 rounded-full" />
                  </div>
                  <p className="text-[10px] text-right mt-1 text-muted-foreground">75% Funded</p>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 z-30 animate-float" style={{ animationDelay: '2s' }}>
                <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm font-medium">Network Operational</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
