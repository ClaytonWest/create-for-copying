"use client"
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const generateDummyData = (period: "1d" | "1w" | "1m", points: number) => {
  const data = []
  let value = 50000
  const now = new Date()
  for (let i = 0; i < points; i++) {
    let dateLabel
    const dateObj = new Date()
    if (period === "1d") {
      dateObj.setHours(now.getHours() - (points - 1 - i) * (24 / points))
      dateLabel = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (period === "1w") {
      dateObj.setDate(now.getDate() - (points - 1 - i))
      dateLabel = dateObj.toLocaleDateString([], { month: "short", day: "numeric" })
    } else {
      // 1m
      dateObj.setDate(now.getDate() - Math.floor((points - 1 - i) * (30 / points)))
      dateLabel = dateObj.toLocaleDateString([], { month: "short", day: "numeric" })
    }
    value += (Math.random() - 0.48) * (value * 0.025)
    if (value < 10000) value = 10000 + Math.random() * 1000
    data.push({ date: dateLabel, value: Number.parseFloat(value.toFixed(2)) })
  }
  return data
}

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(var(--chart-1))", // Default shadcn chart color
  },
} satisfies ChartConfig

export function HoldingsChart() {
  const [timeRange, setTimeRange] = useState<"1d" | "1w" | "1m">("1d")

  const activeData = useMemo(() => {
    const pointsMap = { "1d": 24, "1w": 7, "1m": 30 }
    return generateDummyData(timeRange, pointsMap[timeRange])
  }, [timeRange])

  return (
    <Card className="bg-navy/80 border-gold/50 text-white shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-gold">Holdings Value Over Time</CardTitle>
            <CardDescription className="text-gray-300 mt-1">Illustrative historical performance.</CardDescription>
          </div>
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)} className="w-full sm:w-auto">
            <TabsList className="bg-navy border border-gold/50 grid grid-cols-3 sm:inline-flex w-full sm:w-auto">
              <TabsTrigger
                value="1d"
                className="data-[state=active]:bg-gold data-[state=active]:text-navy text-gray-300 text-xs px-2 py-1 sm:px-3"
              >
                1D
              </TabsTrigger>
              <TabsTrigger
                value="1w"
                className="data-[state=active]:bg-gold data-[state=active]:text-navy text-gray-300 text-xs px-2 py-1 sm:px-3"
              >
                1W
              </TabsTrigger>
              <TabsTrigger
                value="1m"
                className="data-[state=active]:bg-gold data-[state=active]:text-navy text-gray-300 text-xs px-2 py-1 sm:px-3"
              >
                1M
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[16/7] w-full h-[300px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))", strokeOpacity: 0.5 }}
                tickMargin={8}
                style={{ fontSize: "0.7rem", fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "hsl(var(--border))", strokeOpacity: 0.5 }}
                tickMargin={8}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                style={{ fontSize: "0.7rem", fill: "hsl(var(--muted-foreground))" }}
                domain={["dataMin - 5000", "dataMax + 5000"]}
              />
              <ChartTooltip
                cursor={{ stroke: "hsl(var(--gold))", strokeWidth: 1, strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelClassName="text-sm font-semibold"
                    formatter={(value) =>
                      typeof value === "number"
                        ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : value
                    }
                    className="bg-navy/90 text-white border-gold/70 shadow-lg rounded-md"
                  />
                }
              />
              <Line
                dataKey="value"
                type="monotone"
                stroke={chartConfig.value.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: chartConfig.value.color, stroke: "hsl(var(--background))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
