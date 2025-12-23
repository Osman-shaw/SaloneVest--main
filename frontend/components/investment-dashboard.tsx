"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InvestmentCard } from "./investment-card"

const mockInvestments = [
  {
    id: "1",
    name: "Sierra Leone Tech Fund",
    type: "Growth",
    riskLevel: "Moderate",
    expectedYield: "18.5%",
    minInvestment: "$100",
    description: "Diversified portfolio of tech startups in West Africa",
  },
  {
    id: "2",
    name: "Agricultural Innovation",
    type: "Income",
    riskLevel: "Low",
    expectedYield: "8.2%",
    minInvestment: "$50",
    description: "Sustainable farming initiatives supporting local communities",
  },
  {
    id: "3",
    name: "Government Treasury Bills",
    type: "Income",
    riskLevel: "Low",
    expectedYield: "6.5%",
    minInvestment: "$100",
    description: "12-month treasury bills backed by Sierra Leone government",
  },
  {
    id: "4",
    name: "Solar Energy Fund",
    type: "Impact",
    riskLevel: "Moderate",
    expectedYield: "12.3%",
    minInvestment: "$100",
    description: "Clean energy projects across Sierra Leone",
  },
  {
    id: "5",
    name: "FinTech Startup - Series A",
    type: "Growth",
    riskLevel: "High",
    expectedYield: "28.5%",
    minInvestment: "$500",
    description: "Leading mobile money platform expansion",
  },
  {
    id: "6",
    name: "Education Impact Bond",
    type: "Impact",
    riskLevel: "Low",
    expectedYield: "7.8%",
    minInvestment: "$100",
    description: "Skills training and vocational programs",
  },
]

export function InvestmentDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  const filters = ["Growth", "Income", "Impact"]

  const filteredInvestments = mockInvestments.filter((investment) => {
    const matchesSearch =
      investment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investment.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !selectedFilter || investment.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-pretty">Investment Opportunities</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Discover vetted investment opportunities in Sierra Leone. All investments are denominated in USDC.
          </p>
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
            <InvestmentCard key={investment.id} investment={investment} />
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
