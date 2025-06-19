"use client"
import useSWR from "swr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleDollarSign, PackageOpen, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

type Holding = {
  id: string
  metal: string
  quantity: number
  unit: string
  valuePerUnit: number
  vault: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function PositionsTable() {
  const { data: holdings, error, isLoading } = useSWR<Holding[]>("/api/holdings", fetcher)
  const { toast } = useToast()

  const handleSell = (holdingId: string, metal: string, quantity: number, unit: string) => {
    toast({
      title: "Simulated Sell Order",
      description: `Your order to sell ${quantity} ${unit} of ${metal} (ID: ${holdingId}) has been placed (simulated).`,
      variant: "default",
      className: "bg-navy text-white border-gold",
    })
  }

  if (isLoading) {
    return (
      <Card className="bg-navy/80 border-gold/50 text-white shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-6 w-6 text-gold" />
            <CardTitle className="text-gold">Your Holdings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-navy/80 border-gold/50 text-white shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <CardTitle className="text-gold">Error Loading Holdings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Failed to load your positions. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  if (!holdings || holdings.length === 0) {
    return (
      <Card className="bg-navy/80 border-gold/50 text-white shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <PackageOpen className="h-6 w-6 text-gold" />
            <CardTitle className="text-gold">Your Holdings</CardTitle>
          </div>
          <CardDescription className="text-gray-300 mt-1">You currently have no holdings.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-400 py-8">
            Start building your portfolio by purchasing gold or other precious metals.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-navy/80 border-gold/50 text-white shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-6 w-6 text-gold" />
          <CardTitle className="text-gold">Your Holdings</CardTitle>
        </div>
        <CardDescription className="text-gray-300 mt-1">Overview of your precious metal assets.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="text-white min-w-[700px]">
          <TableHeader>
            <TableRow className="border-gold/30 hover:bg-navy/90">
              <TableHead className="text-gold font-semibold">Metal</TableHead>
              <TableHead className="text-gold font-semibold">Quantity</TableHead>
              <TableHead className="text-gold font-semibold">Unit</TableHead>
              <TableHead className="text-gold font-semibold text-right">Est. Value/Unit</TableHead>
              <TableHead className="text-gold font-semibold text-right">Est. Total Value</TableHead>
              <TableHead className="text-gold font-semibold">Vault Location</TableHead>
              <TableHead className="text-gold font-semibold text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow key={holding.id} className="border-gold/30 hover:bg-navy/70">
                <TableCell className="font-medium">{holding.metal}</TableCell>
                <TableCell>{holding.quantity.toLocaleString()}</TableCell>
                <TableCell className="capitalize">{holding.unit}</TableCell>
                <TableCell className="text-right">
                  $
                  {holding.valuePerUnit.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  $
                  {(holding.quantity * holding.valuePerUnit).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>{holding.vault}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gold text-gold hover:bg-gold hover:text-navy focus:ring-gold focus:ring-offset-0"
                    onClick={() => handleSell(holding.id, holding.metal, holding.quantity, holding.unit)}
                  >
                    Sell
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
