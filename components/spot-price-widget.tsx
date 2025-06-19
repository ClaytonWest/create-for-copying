"use client"
import useSWR from "swr"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const GRAMS_PER_UNIT: Record<string, number> = {
  gram: 1,
  ounce: 31.1035,
  kilogram: 1000,
  pound: 453.592,
}

type Unit = "gram" | "ounce" | "kilogram" | "pound"

export function SpotPriceWidget() {
  const { data, error, isLoading } = useSWR("/api/price", fetcher, { refreshInterval: 15000 })
  const [selectedUnit, setSelectedUnit] = useState<Unit>("gram")
  const [currentDisplayPrice, setCurrentDisplayPrice] = useState<string | null>(null)
  const [previousDisplayPrice, setPreviousDisplayPrice] = useState<string | null>(null)

  useEffect(() => {
    if (data && data.price) {
      const pricePerGram = data.price
      const convertedPrice = (pricePerGram * GRAMS_PER_UNIT[selectedUnit]) / GRAMS_PER_UNIT["gram"] // Convert from API's gram price to selected unit price

      if (currentDisplayPrice !== null) {
        setPreviousDisplayPrice(currentDisplayPrice)
      }
      setCurrentDisplayPrice(convertedPrice.toFixed(2))
    }
  }, [data, selectedUnit, currentDisplayPrice])

  let priceColorClass = "text-gray-100"
  let priceChangeIndicator = null

  if (currentDisplayPrice && previousDisplayPrice) {
    const current = Number.parseFloat(currentDisplayPrice)
    const previous = Number.parseFloat(previousDisplayPrice)
    if (current > previous) {
      priceColorClass = "text-green-400"
      priceChangeIndicator = <TrendingUp className="inline-block h-4 w-4 ml-1" />
    } else if (current < previous) {
      priceColorClass = "text-red-400"
      priceChangeIndicator = <TrendingUp className="inline-block h-4 w-4 ml-1 transform rotate-180" /> // Simple down indicator
    }
  }

  const cardContent = () => {
    if (isLoading && !data) {
      return (
        <>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </>
      )
    }
    if (error) {
      return (
        <div className="flex items-center text-red-400">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Failed to load price.</span>
        </div>
      )
    }
    if (data && currentDisplayPrice) {
      return (
        <>
          <div className={`text-3xl font-bold transition-colors duration-300 ${priceColorClass}`}>
            ${currentDisplayPrice}
            {priceChangeIndicator}
          </div>
          <div className="text-sm text-gray-400">per {selectedUnit}</div>
        </>
      )
    }
    return <Skeleton className="h-8 w-3/4" /> // Fallback skeleton
  }

  return (
    <Card className="bg-navy/80 border-gold/50 text-white w-full shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium text-gold">Live Gold Spot Price</CardTitle>
        <TrendingUp className="h-5 w-5 text-gold" />
      </CardHeader>
      <CardContent>
        <div className="min-h-[60px]">
          {" "}
          {/* Ensure consistent height during loading/error */}
          {cardContent()}
        </div>
        <div className="mt-4">
          <Select
            value={selectedUnit}
            onValueChange={(value: Unit) => {
              setPreviousDisplayPrice(null) // Reset previous price on unit change to avoid false trend
              setSelectedUnit(value)
            }}
          >
            <SelectTrigger className="w-full bg-navy text-white border-gold/70 focus:ring-gold focus:ring-offset-0 focus:border-gold">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent className="bg-navy text-white border-gold/70">
              {Object.keys(GRAMS_PER_UNIT).map((unit) => (
                <SelectItem
                  key={unit}
                  value={unit}
                  className="capitalize hover:bg-gold/20 focus:bg-gold/20 cursor-pointer"
                >
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {data && data.timestamp && (
          <p className="text-xs text-gray-500 mt-3">Last updated: {new Date(data.timestamp).toLocaleTimeString()}</p>
        )}
      </CardContent>
    </Card>
  )
}
