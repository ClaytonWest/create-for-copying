"use client"
import useSWR from "swr"
import { PriceChart } from "@/components/price-chart"
import { TradeBox } from "@/components/trade-box"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDown, ArrowUp } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function PositionCard({ symbol }: { symbol: string }) {
  const { data: portfolio, error, isLoading } = useSWR("/api/portfolio", fetcher)

  if (isLoading)
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  if (error) return <p className="text-rh-red">Failed to load position.</p>

  const position = portfolio.positions.find((p: any) => p.symbol === symbol)
  if (!position) return <p>No position found for {symbol}.</p>

  const isTodayPositive = position.todayReturn > 0
  const isTotalPositive = position.totalReturn > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Position</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Equity</p>
          <p className="font-semibold">${position.equity.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Quantity</p>
          <p className="font-semibold">
            {position.quantity.toLocaleString()} {position.unit}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Average Cost</p>
          <p className="font-semibold">${position.averageCost.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Today's Return</p>
          <p className={`font-semibold flex items-center gap-1 ${isTodayPositive ? "text-rh-green" : "text-rh-red"}`}>
            {isTodayPositive ? "+" : ""}${position.todayReturn.toLocaleString()} ({position.todayReturnPercent}%)
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Return</p>
          <p className={`font-semibold flex items-center gap-1 ${isTotalPositive ? "text-rh-green" : "text-rh-red"}`}>
            {isTotalPositive ? "+" : ""}${position.totalReturn.toLocaleString()} ({position.totalReturnPercent}%)
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Portfolio Diversity</p>
          <p className="font-semibold">{position.portfolioDiversity}%</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MetalDetailPage({ params }: { params: { symbol: string } }) {
  const { data, error, isLoading } = useSWR(`/api/metals/${params.symbol}`, fetcher)

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (error) return <p className="text-center text-rh-red py-20">Failed to load metal data.</p>

  const isPositive = data.change > 0

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">{data.name}</h1>
            <p className="text-3xl font-bold mt-1">${data.price.toLocaleString()}</p>
            <div
              className={`flex items-center gap-2 text-sm font-medium mt-1 ${isPositive ? "text-rh-green" : "text-rh-red"}`}
            >
              {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              <span>
                {isPositive ? "+" : ""}${data.change.toLocaleString()} ({data.changePercent}%) Today
              </span>
            </div>
          </div>
          <PriceChart historicalData={data.historical} isPositiveChange={isPositive} isLoading={false} />
          <PositionCard symbol={params.symbol.toUpperCase()} />
        </div>
        <div className="lg:col-span-1">
          <TradeBox metalSymbol={params.symbol.toUpperCase()} metalPricePerOunce={data.price} />
        </div>
      </div>
    </div>
  )
}
