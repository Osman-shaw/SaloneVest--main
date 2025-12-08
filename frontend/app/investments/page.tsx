"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Share2,
  Heart,
  BarChart3,
} from "lucide-react"
import { investments } from "@/lib/opportunities-data"
import Link from "next/link"

const categoryIcons = {
  startup: "🚀",
  mutual_fund: "📊",
  treasury_bill: "🏛️",
  government_bond: "💼",
  business: "🏢",
}

const riskColors = {
  low: "bg-green-500/10 text-green-700 border-green-200",
  medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  high: "bg-red-500/10 text-red-700 border-red-200",
}

const statusBadges = {
  active: { label: "Active", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  ending_soon: { label: "Ending Soon", color: "bg-orange-500/10 text-orange-700 border-orange-200" },
  closed: { label: "Closed", color: "bg-gray-500/10 text-gray-700 border-gray-200" },
}

export default function InvestmentDetailPage() {
  const searchParams = useSearchParams()
  const investmentId = searchParams.get("id")
  const investment = investments.find((inv) => inv.id === investmentId)
  const [investmentAmount, setInvestmentAmount] = useState<string>("")
  const [showInvestDialog, setShowInvestDialog] = useState(false)

  if (!investment) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar isConnected={true} />
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Investment Not Found</h1>
          <p className="text-muted-foreground mb-6">The investment opportunity you're looking for doesn't exist.</p>
          <Link href="/opportunities">
            <Button>Back to Opportunities</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const fundingPercentage = (investment.fundingCurrent / investment.fundingGoal) * 100
  const remainingGoal = investment.fundingGoal - investment.fundingCurrent

  const handleInvest = () => {
    if (parseFloat(investmentAmount) < investment.minInvestment) {
      alert(`Minimum investment is $${investment.minInvestment.toLocaleString()}`)
      return
    }
    if (parseFloat(investmentAmount) > investment.maxInvestment) {
      alert(`Maximum investment is $${investment.maxInvestment.toLocaleString()}`)
      return
    }
    // In a real app, this would submit to the backend
    alert(`Investment of $${investmentAmount} submitted! (Demo mode)`)
    setShowInvestDialog(false)
    setInvestmentAmount("")
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar isConnected={true} />

      {/* Header */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-8 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link href="/opportunities">
              <Button variant="ghost" className="mb-4">
                ← Back to Opportunities
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">{categoryIcons[investment.category]}</span>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{investment.name}</h1>
                  <p className="text-lg text-muted-foreground">{investment.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="text-sm">
                  {investment.category.replace("_", " ")}
                </Badge>
                <Badge
                  variant="outline"
                  className={`${riskColors[investment.riskLevel]} text-sm`}
                >
                  {investment.riskLevel.charAt(0).toUpperCase() + investment.riskLevel.slice(1)} Risk
                </Badge>
                <Badge
                  variant="outline"
                  className={`${statusBadges[investment.status].color} text-sm`}
                >
                  {statusBadges[investment.status].label}
                </Badge>
              </div>
            </div>

            <div className="w-full md:w-auto flex gap-3">
              <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Invest Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Invest in {investment.name}</DialogTitle>
                    <DialogDescription>
                      Enter the amount you'd like to invest (${investment.minInvestment.toLocaleString()} - ${investment.maxInvestment.toLocaleString()})
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Investment Amount (USDC)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          className="flex-1"
                        />
                        <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">
                          USDC
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Min: ${investment.minInvestment.toLocaleString()} | Max: ${investment.maxInvestment.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Expected Annual Return:</span>
                        <span className="font-semibold text-green-600">
                          ${((parseFloat(investmentAmount) || 0) * investment.roi / 100).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Investment Duration:</span>
                        <span className="font-semibold">{investment.duration}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleInvest}
                      disabled={!investmentAmount}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                    >
                      Confirm Investment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="icon" className="w-10 h-10">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-10 h-10">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Annual ROI</p>
                      <p className="text-2xl font-bold text-green-600">{investment.roi}%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Minimum Investment</p>
                      <p className="text-xl font-bold">${investment.minInvestment.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Investment Period</p>
                      <p className="text-xl font-bold">{investment.duration}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <p className="text-xl font-bold capitalize">{investment.riskLevel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Funding Progress */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Funding Progress
                  </CardTitle>
                  <CardDescription>
                    {fundingPercentage.toFixed(1)}% of goal reached
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold">${investment.fundingCurrent.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Funded</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${remainingGoal.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">To Go</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${investment.fundingGoal.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Goal</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>About This Opportunity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Sector</h3>
                    <p className="text-muted-foreground">{investment.sector}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Funding Stage</h3>
                    <p className="text-muted-foreground">{investment.fundingStage}</p>
                  </div>
                  {investment.highlights.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Key Highlights</h3>
                      <ul className="space-y-2">
                        {investment.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Investment Details */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Investment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Investment Range</p>
                      <p className="font-semibold">
                        ${investment.minInvestment.toLocaleString()} - ${investment.maxInvestment.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Annual Return</p>
                      <p className="font-semibold">{investment.roi}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Investment Period</p>
                      <p className="font-semibold">{investment.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                      <p className="font-semibold capitalize">{investment.riskLevel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="border-border/50 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Investment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Active Investors</p>
                        <p className="font-bold">{investment.investorCount?.toLocaleString() || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Expected Annual Return</p>
                        <p className="font-bold">{investment.roi}%</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Investment Duration</p>
                        <p className="font-bold">{investment.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Risk Assessment</p>
                        <p className="font-bold capitalize">{investment.riskLevel}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-11">
                        Invest Now
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  <p className="text-xs text-muted-foreground text-center">
                    All investments are made through secure USDC transactions on Solana
                  </p>
                </CardContent>
              </Card>

              {/* Risk Disclosure */}
              <Card className="border-yellow-200/50 bg-yellow-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-yellow-700">
                    <AlertCircle className="h-4 w-4" />
                    Risk Disclaimer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-yellow-700">
                    {investment.riskLevel === 'high'
                      ? 'This is a high-risk investment. Past performance does not guarantee future results. Your investment capital may be at risk.'
                      : investment.riskLevel === 'medium'
                      ? 'This is a medium-risk investment. Returns are not guaranteed. Please review all documentation before investing.'
                      : 'This is a low-risk investment backed by government guarantees. However, interest rate and currency risks apply.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
