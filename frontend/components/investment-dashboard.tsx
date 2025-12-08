import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InvestmentCard } from "./investment-card"
import { useInvestments } from "@/hooks/use-investments"
import { Search } from "lucide-react"

export function InvestmentDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const { investments, loading } = useInvestments()

  // Filter options: Growth, Income, Impact (based on investment types)
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
      <div className="space-y-6 md:space-y-8">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[400px] bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search investment opportunities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-lg h-10 md:h-11 pl-10"
        />
      </div>

      {/* Filter Buttons - Types, Growth, Impact etc */}
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

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredInvestments.length} of {investments.length} opportunities
        </p>
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
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery("")
              setSelectedFilter(null)
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
