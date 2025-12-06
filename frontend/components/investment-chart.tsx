"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface InvestmentChartProps {
    data: {
        date: string
        value: number
    }[]
    color?: string
}

export function InvestmentChart({ data, color = "#22c55e" }: InvestmentChartProps) {
    return (
        <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        hide
                    />
                    <YAxis
                        hide
                        domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                    Value
                                                </span>
                                                <span className="font-bold text-muted-foreground">
                                                    ${payload[0].value}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#gradient-${color})`}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
