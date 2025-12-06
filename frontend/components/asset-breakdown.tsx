"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart as PieChartIcon } from "lucide-react"

const data = [
    { name: "Tech Fund", value: 2812, color: "#3b82f6" }, // Blue
    { name: "Treasury Bills", value: 1597, color: "#22c55e" }, // Green
    { name: "Solar Energy", value: 1123, color: "#eab308" }, // Yellow
]

export function AssetBreakdown() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    <CardTitle>Asset Allocation</CardTitle>
                </div>
                <CardDescription>Distribution of your investment portfolio</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => `$${value.toLocaleString()}`}
                                contentStyle={{
                                    backgroundColor: "var(--color-card)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "8px",
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
