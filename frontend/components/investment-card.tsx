"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { InvestModal } from "./invest-modal"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { usePriceFeed } from "@/context/price-feed-context"
import { InvestmentChart } from "./investment-chart"

interface InvestmentCardProps {
  id: string
  title: string
  description: string
  minInvestment: number
  target: number
  raised: number
  category: string
  roi: string
  risk: "Low" | "Medium" | "High"
  image: string
  symbol?: string // Added symbol for price feed mapping
}

export function InvestmentCard({
  id,
  title,
  description,
  minInvestment,
  target,
  raised,
  category,
  roi,
  risk,
  image,
  symbol = "SL50" // Default fallback
}: InvestmentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const percentRaised = Math.min(Math.round((raised / target) * 100), 100)

  const { prices } = usePriceFeed()
  const priceData = prices[symbol] || { price: 10.00, change24h: 0 }
  const isPositive = priceData.change24h >= 0

  // Generate mock history data based on current price and trend
  const historyData = Array.from({ length: 20 }, (_, i) => ({
    date: i.toString(),
    value: priceData.price * (1 + (Math.random() * 0.1 - 0.05) + (isPositive ? 0.02 : -0.02) * (i / 20))
  }))

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg dark:hover:shadow-primary/5 border-muted">
      <div className="relative h-48 w-full overflow-hidden group bg-muted/20 p-4">
        <InvestmentChart data={historyData} color={isPositive ? "#22c55e" : "#ef4444"} />

        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className="backdrop-blur-md bg-background/80 font-semibold">
            {category}
          </Badge>
          <Badge
            variant="outline"
            className={`backdrop-blur-md bg-background/80 font-mono flex items-center gap-1 ${isPositive ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
              }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {priceData.change24h > 0 ? "+" : ""}{priceData.change24h}%
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className="backdrop-blur-md bg-background/80 font-mono text-xs">
            <Activity className="h-3 w-3 mr-1 text-primary" />
            ${priceData.price.toFixed(2)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-1">{title}</CardTitle>
          <Badge
            variant="outline"
            className={
              risk === "Low"
                ? "text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20"
                : risk === "Medium"
                  ? "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
                  : "text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20"
            }
          >
            {risk} Risk
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Raised</span>
            <span className="font-medium">
              ${raised.toLocaleString()} <span className="text-muted-foreground">of ${target.toLocaleString()}</span>
            </span>
          </div>
          <Progress value={percentRaised} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">Min Investment</p>
            <p className="font-semibold">${minInvestment}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Est. ROI</p>
            <p className="font-semibold text-green-600 dark:text-green-400">{roi}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button className="w-full font-semibold shadow-sm" onClick={() => setIsModalOpen(true)}>
          Invest Now
        </Button>
        <InvestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          investmentTitle={title}
          minAmount={minInvestment}
          currentPrice={priceData.price}
        />
      </CardFooter>
    </Card>
  )
}
