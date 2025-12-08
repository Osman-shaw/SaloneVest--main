"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  AlertCircle,
  Filter,
  ArrowUpRight,
} from "lucide-react"
import {
  investments,
  categories,
  sectors,
  type Investment,
} from "@/lib/opportunities-data"
import { useRouter } from "next/navigation"

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

function OpportunityCard({ investment }: { investment: Investment }) {
  const router = useRouter()
  const fundingPercentage = (investment.fundingCurrent / investment.fundingGoal) * 100

  const handleInvest = () => {
    router.push(`/investments?id=${investment.id}`)
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full group border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcons[investment.category]}</span>
            <Badge variant="outline" className="text-xs">
              {investment.category.replace("_", " ")}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={statusBadges[investment.status].color}
          >
            {statusBadges[investment.status].label}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{investment.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {investment.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="space-y-4">
          {/* ROI and Risk */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <TrendingUp className="h-3 w-3" />
                Annual Return
              </div>
              <div className="text-xl font-bold text-green-600">{investment.roi}%</div>
            </div>
            <div className={`rounded-lg p-3 ${riskColors[investment.riskLevel]} border`}>
              <div className="text-xs font-medium mb-1 capitalize">
                {investment.riskLevel} Risk
              </div>
              <div className="text-sm font-semibold">{investment.sector}</div>
            </div>
          </div>

          {/* Key Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Min Investment:</span>
              <span className="font-semibold">${investment.minInvestment.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-semibold">{investment.duration}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Investors:</span>
              <span className="font-semibold">
                {investment.investorCount?.toLocaleString() || "N/A"}
              </span>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Funding Progress</span>
              <span className="font-semibold">{fundingPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>${investment.fundingCurrent.toLocaleString()}</span>
              <span>${investment.fundingGoal.toLocaleString()}</span>
            </div>
          </div>

          {/* Highlights */}
          {investment.highlights.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Highlights:</p>
              <ul className="text-xs space-y-1">
                {investment.highlights.slice(0, 2).map((highlight, i) => (
                  <li key={i} className="flex items-center gap-1 text-muted-foreground">
                    <span className="text-blue-500">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <div className="px-6 pb-6 pt-3 border-t border-border/50">
        <Button
          onClick={handleInvest}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          Invest Now
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}

export default function OpportunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSector, setSelectedSector] = useState("All Sectors")
  const [selectedRisk, setSelectedRisk] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")

  // Filter and sort investments
  const filteredInvestments = useMemo(() => {
    let filtered = investments.filter((inv) => {
      // Category filter
      if (selectedCategory !== "all" && inv.category !== selectedCategory) {
        return false
      }

      // Sector filter
      if (selectedSector !== "All Sectors" && inv.sector !== selectedSector) {
        return false
      }

      // Risk filter
      if (selectedRisk !== "all" && inv.riskLevel !== selectedRisk) {
        return false
      }

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          inv.name.toLowerCase().includes(term) ||
          inv.description.toLowerCase().includes(term) ||
          inv.sector.toLowerCase().includes(term)
        )
      }

      return true
    })

    // Sort
    switch (sortBy) {
      case "roi_desc":
        return filtered.sort((a, b) => b.roi - a.roi)
      case "roi_asc":
        return filtered.sort((a, b) => a.roi - b.roi)
      case "funding":
        return filtered.sort(
          (a, b) =>
            (b.fundingCurrent / b.fundingGoal) - (a.fundingCurrent / a.fundingGoal)
        )
      case "min_investment":
        return filtered.sort((a, b) => a.minInvestment - b.minInvestment)
      case "name":
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
    }
  }, [selectedCategory, selectedSector, selectedRisk, searchTerm, sortBy])

  return (
    <main className="min-h-screen bg-background">
      <Navbar isConnected={true} />

      {/* Header Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent py-12 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                Vetted Investment Opportunities
              </h1>
              <p className="mt-2 text-xl text-muted-foreground">
                Discover {investments.length}+ ways to invest in Sierra Leone's future
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Opportunities</p>
                      <p className="text-2xl font-bold">{investments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. ROI</p>
                      <p className="text-2xl font-bold">
                        {(investments.reduce((sum, inv) => sum + inv.roi, 0) / investments.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Investors</p>
                      <p className="text-2xl font-bold">
                        {investments
                          .reduce((sum, inv) => sum + (inv.investorCount || 0), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <Target className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Funded</p>
                      <p className="text-2xl font-bold">
                        ${(investments.reduce((sum, inv) => sum + inv.fundingCurrent, 0) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search opportunities..."
                  className="pl-10 bg-card border-border/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-card border-border/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="roi_desc">Highest ROI</SelectItem>
                  <SelectItem value="roi_asc">Lowest ROI</SelectItem>
                  <SelectItem value="funding">Most Funded</SelectItem>
                  <SelectItem value="min_investment">Min Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category and Filter Chips */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Categories:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="text-xs"
                  >
                    {cat.label} <span className="ml-1 text-xs opacity-75">({cat.count})</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Sector and Risk Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Sector
                </label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="bg-card border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Risk Level
                </label>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger className="bg-card border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredInvestments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted/50 p-4 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No opportunities found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Try adjusting your filters or search terms
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all")
                  setSelectedSector("All Sectors")
                  setSelectedRisk("all")
                  setSearchTerm("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {filteredInvestments.length} Opportunities Found
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvestments.map((investment) => (
                  <OpportunityCard
                    key={investment.id}
                    investment={investment}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
