import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InvestmentCard } from "./investment-card"
import { useInvestments } from "@/hooks/use-investments"

export function InvestmentDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const { investments, loading } = useInvestments()

  const filters = ["Growth", "Income", "Impact"]

  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch =
      investment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investment.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !selectedFilter || investment.type.toLowerCase() === selectedFilter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-6 md:space-y-8">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-pretty">Investment Opportunities</h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Discover vetted investment opportunities in Sierra Leone. All investments are denominated in USDC.
            </p>
          </div>
          <Button onClick={() => window.location.href = '/portfolio'} variant="outline" className="md:self-start">
            View My Portfolio
          </Button>
        </div>

        <div className="space-y-3 md:space-y-4">
          <Input
            placeholder="Search investments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg h-10 md:h-11"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFilter === null ? "default" : "outline"}
              onClick={() => setSelectedFilter(null)}
              className="rounded-full text-sm h-9"
            >
              All Types
            </Button>
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter)}
                className="rounded-full text-sm h-9"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Investment Cards Grid */}
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInvestments.map((investment) => (
            <InvestmentCard
              key={investment.id}
              id={investment.id}
              title={investment.name}
              description={investment.description}
              minInvestment={parseInt(investment.minInvestment.replace('$', '').replace(',', ''))}
              target={investment.targetAmount}
              raised={investment.totalRaised}
              category={investment.type}
              roi={investment.expectedYield}
              risk={investment.riskLevel as "Low" | "Medium" | "High"}
              image="/placeholder.svg" // Mock image
              symbol={investment.symbol}
            />
          ))}
        </div>

        {filteredInvestments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No investments match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
