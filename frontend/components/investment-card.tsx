"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { InvestModal } from "./invest-modal"
import { TrendingUp } from "lucide-react"

interface Investment {
  id: string
  name: string
  type: string
  riskLevel: string
  expectedYield: string
  minInvestment: string
  description: string
}

interface InvestmentCardProps {
  investment: Investment
}

export function InvestmentCard({ investment }: InvestmentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300"
      case "Moderate":
        return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300"
      case "High":
        return "bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-300"
      default:
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-300"
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:p-6 hover:shadow-lg hover:border-primary/50 transition-all">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base md:text-lg font-semibold text-foreground flex-1">{investment.name}</h3>
            <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{investment.description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className={`px-2.5 md:px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.riskLevel)}`}
          >
            {investment.riskLevel} Risk
          </span>
          <span className="text-xs md:text-sm font-medium text-muted-foreground">{investment.type}</span>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs md:text-sm text-muted-foreground">Expected Yield</span>
            <span className="text-xl md:text-2xl font-bold text-primary">{investment.expectedYield}</span>
          </div>
          <div className="text-xs text-muted-foreground mb-4">Minimum: {investment.minInvestment}</div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg h-10 md:h-11 text-sm md:text-base"
        >
          Invest Now
        </Button>
      </div>

      <InvestModal investment={investment} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
