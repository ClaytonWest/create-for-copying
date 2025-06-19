"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, AlertCircle } from "lucide-react"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton"

type Holding = {
  id: string
  metal: string
  quantity: number
  unit: string // e.g., "gram", "ounce"
  valuePerUnit: number // Value in USD for the given unit
  vault: string
}

const GRAMS_PER_UNIT: Record<string, number> = {
  gram: 1,
  ounce: 31.1035,
  kilogram: 1000,
  pound: 453.592,
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function PortfolioSummary() {
  const { data: holdings, error, isLoading } = useSWR<Holding[]>("/api/holdings", fetcher)
  const { data: priceData } = useSWR("/api/price", fetcher, { refreshInterval: 30000 }) // For more current valuation

  let totalValue = 0
  let valueCalculated = false

  if (holdings && priceData) {
    totalValue = holdings.reduce((acc, holding) => {
      const quantityInGrams = holding.quantity * (GRAMS_PER_UNIT[holding.unit.toLowerCase()] || 1)
      const currentValue = quantityInGrams * priceData.price // priceData.price is per gram
      return acc + currentValue
    }, 0)
    valueCalculated = true
  } else if (holdings && !priceData) {
    // Fallback if price API fails but holdings are there
    totalValue = holdings.reduce((acc, holding) => {
      return acc + holding.quantity * holding.valuePerUnit // Use stale valuePerUnit from holdings
    }, 0)
    valueCalculated = true
  }

  const cardContent = () => {
    if (isLoading) {
      return <Skeleton className="h-10 w-3/4" />
    }
    if (error) {
      return (
        <div className="flex items-center text-red-400">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Error loading summary.</span>
        </div>
      )
    }
    if (valueCalculated) {
      return (
        <>
          <div className="text-3xl font-bold text-white">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-400 pt-1">
            {priceData ? "Based on current market prices." : "Based on last known prices."}
          </p>
        </>
      )
    }
    return <Skeleton className="h-10 w-3/4" /> // Fallback if data is partially loaded
  }

  return (
    <Card className="bg-navy/80 border-gold/50 text-white shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium text-gold">Total Portfolio Value</CardTitle>
        <DollarSign className="h-5 w-5 text-gold" />
      </CardHeader>
      <CardContent className="min-h-[70px]">
        {" "}
        {/* Consistent height */}
        {cardContent()}
      </CardContent>
    </Card>
  )
}
