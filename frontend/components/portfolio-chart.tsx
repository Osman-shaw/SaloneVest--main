"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const data = [
  { date: "Week 1", value: 5000 },
  { date: "Week 2", value: 5120 },
  { date: "Week 3", value: 4890 },
  { date: "Week 4", value: 5234 },
  { date: "Week 5", value: 5412 },
  { date: "Week 6", value: 5532 },
  { date: "Week 7", value: 5789 },
  { date: "Week 8", value: 5910 },
]

export function PortfolioChart() {
  const startValue = data[0].value
  const endValue = data[data.length - 1].value
  const totalGain = endValue - startValue
  const gainPercentage = ((totalGain / startValue) * 100).toFixed(2)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Portfolio Performance</CardTitle>
            </div>
            <CardDescription>Historical growth of your total portfolio value</CardDescription>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total Gain</p>
              <p className="text-lg md:text-xl font-bold text-primary">${totalGain.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Return %</p>
              <p className="text-lg md:text-xl font-bold text-primary">+{gainPercentage}%</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  padding: "8px",
                }}
                labelStyle={{ color: "var(--color-foreground)", fontSize: "12px" }}
                formatter={(value: any) => `$${value.toFixed(2)}`}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="value"
                name="Portfolio Value"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: "var(--color-primary)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
