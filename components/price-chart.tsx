"use client"
import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"

interface PriceChartProps {
  historicalData: Record<TimeRange, { date: string; price: number }[]>
  isPositiveChange: boolean
  isLoading: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Price</span>
            <span className="font-bold text-muted-foreground">${payload[0].value.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
            <span className="font-bold">{label}</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function PriceChart({ historicalData, isPositiveChange, isLoading }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1D")

  const chartData = useMemo(() => historicalData[timeRange] || [], [historicalData, timeRange])

  // Use hsl(var(--css-variable-name)) for Recharts stroke/fill props
  const chartColor = isPositiveChange ? "hsl(var(--rh-green-hsl))" : "hsl(var(--rh-red-hsl))"

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  return (
    <div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={chartColor} // This will now correctly use the CSS variable
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, style: { fill: chartColor, stroke: "hsl(var(--background))" } }}
            />
            <YAxis domain={["dataMin", "dataMax"]} hide />
            <XAxis dataKey="date" hide />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)} className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-6 bg-transparent p-0">
          {(["1D", "1W", "1M", "3M", "1Y", "5Y"] as TimeRange[]).map((range) => (
            <TabsTrigger
              key={range}
              value={range}
              className="text-xs font-semibold text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {range}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
