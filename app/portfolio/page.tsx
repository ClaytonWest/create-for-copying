"use client"
import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PriceChart } from "@/components/price-chart"
import { ArrowDown, ArrowUp } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function MetalsWatchlist() {
  const { data: metals, error, isLoading } = useSWR("/api/metals", fetcher, { refreshInterval: 15000 })

  if (isLoading)
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  if (error) return <p className="text-rh-red">Failed to load watchlist.</p>

  return (
    <div className="space-y-2">
      {metals.map((metal: any) => (
        <Link href={`/metal/${metal.symbol}`} key={metal.symbol} className="block">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <p className="font-bold">{metal.symbol}</p>
                <p className="text-xs text-muted-foreground">{metal.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${metal.price.toFixed(2)}</p>
                <p className={`text-sm font-medium ${metal.change > 0 ? "text-rh-green" : "text-rh-red"}`}>
                  {metal.change > 0 ? "+" : ""}
                  {metal.change.toFixed(2)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function PortfolioPage() {
  const { data: portfolio, error: portfolioError, isLoading: portfolioLoading } = useSWR("/api/portfolio", fetcher)
  const { data: chartData, error: chartError, isLoading: chartLoading } = useSWR("/api/metals/XAU", fetcher)

  const isPositive = portfolio?.todayChangeValue > 0

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {portfolioLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
          ) : portfolioError ? (
            <p className="text-rh-red">Failed to load portfolio value.</p>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">Investing</p>
              <h1 className="text-4xl md:text-5xl font-bold">${portfolio.totalValue.toLocaleString()}</h1>
              <div
                className={`flex items-center gap-2 text-sm font-medium mt-1 ${isPositive ? "text-rh-green" : "text-rh-red"}`}
              >
                {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                <span>
                  ${portfolio.todayChangeValue.toLocaleString()} ({portfolio.todayChangePercent}%) Today
                </span>
              </div>
            </div>
          )}

          <div className="w-full">
            {chartLoading || chartError ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <PriceChart
                historicalData={chartData.historical}
                isPositiveChange={chartData.change > 0}
                isLoading={false}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-semibold">Metals</h2>
          <MetalsWatchlist />
        </div>
      </div>
    </div>
  )
}
