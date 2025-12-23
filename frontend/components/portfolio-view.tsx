"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PortfolioChart } from "./portfolio-chart"

const mockPortfolio = [
  {
    id: "1",
    assetName: "Sierra Leone Tech Fund",
    principal: 2500,
    currentValue: 2812,
    accruedReturns: 312,
  },
  {
    id: "2",
    assetName: "Government Treasury Bills",
    principal: 1500,
    currentValue: 1597,
    accruedReturns: 97,
  },
  {
    id: "3",
    assetName: "Solar Energy Fund",
    principal: 1000,
    currentValue: 1123,
    accruedReturns: 123,
  },
]

export function PortfolioView() {
  const totalPrincipal = mockPortfolio.reduce((sum, asset) => sum + asset.principal, 0)
  const totalCurrentValue = mockPortfolio.reduce((sum, asset) => sum + asset.currentValue, 0)
  const totalReturns = mockPortfolio.reduce((sum, asset) => sum + asset.accruedReturns, 0)
  const returnPercentage = ((totalReturns / totalPrincipal) * 100).toFixed(2)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-pretty">Your Portfolio</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Track your investments and monitor returns in real-time.
          </p>
        </div>

        <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">${totalPrincipal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Principal amount</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Current Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">${totalCurrentValue.toFixed(2)}</div>
              <p className="text-xs text-primary mt-1">+${totalReturns.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Accrued Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-primary">${totalReturns.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">{returnPercentage}% ROI</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">{mockPortfolio.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active investments</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <PortfolioChart />

        {/* Holdings Table - Responsive */}
        <Card>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>Detailed view of all your investments</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-foreground font-semibold text-xs md:text-sm">Asset Name</TableHead>
                  <TableHead className="text-right text-foreground font-semibold text-xs md:text-sm">
                    Principal
                  </TableHead>
                  <TableHead className="text-right text-foreground font-semibold text-xs md:text-sm">Current</TableHead>
                  <TableHead className="text-right text-foreground font-semibold text-xs md:text-sm">Returns</TableHead>
                  <TableHead className="text-right text-foreground font-semibold text-xs md:text-sm">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPortfolio.map((asset) => {
                  const returnPct = ((asset.accruedReturns / asset.principal) * 100).toFixed(2)
                  return (
                    <TableRow key={asset.id} className="border-border hover:bg-muted/50">
                      <TableCell className="text-foreground font-medium text-xs md:text-sm whitespace-nowrap">
                        {asset.assetName}
                      </TableCell>
                      <TableCell className="text-right text-foreground text-xs md:text-sm whitespace-nowrap">
                        ${asset.principal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-foreground text-xs md:text-sm whitespace-nowrap">
                        ${asset.currentValue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-xs md:text-sm whitespace-nowrap">
                        <span className="text-primary font-semibold">${asset.accruedReturns.toFixed(2)}</span>
                      </TableCell>
                      <TableCell className="text-right text-xs md:text-sm whitespace-nowrap">
                        <span className="text-primary font-semibold">+{returnPct}%</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
