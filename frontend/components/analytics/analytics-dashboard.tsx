"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, TrendingUp, ShieldCheck, PieChart } from "lucide-react"

export function AnalyticsDashboard() {
    // Mock data for analytics
    const diversificationScore = 75
    const riskLevel = "Moderate"
    const projectedYield = 12.5

    const sectorAllocation = [
        { name: "Technology", value: 35, color: "bg-blue-500" },
        { name: "Agriculture", value: 25, color: "bg-green-500" },
        { name: "Real Estate", value: 20, color: "bg-yellow-500" },
        { name: "Gov Bonds", value: 15, color: "bg-purple-500" },
        { name: "Other", value: 5, color: "bg-gray-500" },
    ]

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Diversification Score</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{diversificationScore}/100</div>
                        <Progress value={diversificationScore} className="h-2 mt-2" />
                        <p className="text-xs text-muted-foreground mt-2">
                            Well diversified across 4 major sectors.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Risk Analysis</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{riskLevel}</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Balanced exposure to growth and stable assets.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proj. Annual Yield</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{projectedYield}%</div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Estimated based on historical performance.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sector Allocation</CardTitle>
                    <CardDescription>Breakdown of your portfolio by industry sector.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sectorAllocation.map((sector) => (
                            <div key={sector.name} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{sector.name}</span>
                                    <span className="text-muted-foreground">{sector.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${sector.color}`}
                                        style={{ width: `${sector.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
