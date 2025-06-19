"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PriceChart } from "@/components/price-chart"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HomePage() {
  const { data, error, isLoading } = useSWR("/api/metals/XAU", fetcher)

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">Own physical gold in minutes.</h1>
      <p className="max-w-xl mx-auto mt-4 text-lg text-muted-foreground">
        The new standard in precious metals investing.
      </p>
      <div className="mt-8">
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
          <Link href="/portfolio">Enter Portfolio</Link>
        </Button>
      </div>
      <div className="max-w-4xl mx-auto mt-16">
        {isLoading || error ? (
          <div className="h-[350px] w-full animate-pulse bg-muted-foreground/10 rounded-md" />
        ) : (
          <PriceChart historicalData={data.historical} isPositiveChange={data.change > 0} isLoading={false} />
        )}
      </div>
    </div>
  )
}
