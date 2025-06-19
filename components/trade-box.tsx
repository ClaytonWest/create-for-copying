"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { Info, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TradeBoxProps {
  metalSymbol: string
  metalPricePerOunce: number // Base price for conversion
  // In a real app, you'd pass user's holdings per vault for the selected metal
  // userHoldingsInVaults?: { vaultId: string; vaultName: string; quantity: number }[];
}

const CONVERSION_RATES: Record<string, number> = {
  gram: 0.035274, // to ounce
  ounce: 1,
  kilogram: 35.274, // to ounce
  pound: 16, // to ounce
}

const ALL_VAULT_LOCATIONS = [
  { id: "zurich", name: "Zurich, Switzerland" },
  { id: "london", name: "London, UK" },
  { id: "newyork", name: "New York, USA" },
  { id: "singapore", name: "Singapore" },
  { id: "toronto", name: "Toronto, Canada" },
]

export function TradeBox({ metalSymbol, metalPricePerOunce }: TradeBoxProps) {
  const { unit, setUnit, currency, setCurrency, isMounted } = useUserPreferences()
  const [fiatAmount, setFiatAmount] = useState("")
  const [weightAmount, setWeightAmount] = useState("")
  const [activeTab, setActiveTab] = useState("buy")
  const [selectedVault, setSelectedVault] = useState(ALL_VAULT_LOCATIONS[0].id)
  const { toast } = useToast()

  const pricePerSelectedUnit = metalPricePerOunce * CONVERSION_RATES[unit]

  useEffect(() => {
    if (fiatAmount && Number.parseFloat(fiatAmount) > 0) {
      const weight = Number.parseFloat(fiatAmount) / pricePerSelectedUnit
      if (!isNaN(weight)) {
        setWeightAmount(weight.toFixed(5))
      }
    } else if (fiatAmount === "") {
      setWeightAmount("")
    }
  }, [fiatAmount, pricePerSelectedUnit])

  useEffect(() => {
    if (weightAmount && Number.parseFloat(weightAmount) > 0) {
      const fiat = Number.parseFloat(weightAmount) * pricePerSelectedUnit
      if (!isNaN(fiat)) {
        setFiatAmount(fiat.toFixed(2))
      }
    } else if (weightAmount === "") {
      setFiatAmount("")
    }
  }, [weightAmount, pricePerSelectedUnit])

  const handleSubmit = () => {
    // Simulate trade submission
    toast({
      title: `Simulated ${activeTab} Order`,
      description: `${activeTab === "buy" ? "Bought" : "Sold"} ${weightAmount} ${unit} of ${metalSymbol} (${fiatAmount} ${currency}) ${activeTab === "buy" ? "to" : "from"} vault: ${ALL_VAULT_LOCATIONS.find((v) => v.id === selectedVault)?.name}.`,
      className: "bg-background text-foreground border",
    })
    setFiatAmount("")
    setWeightAmount("")
  }

  // For "Sell" tab, filter vaults based on where user holds the metal.
  // This is a placeholder. In a real app, `userHoldingsInVaults` prop would be used.
  const availableVaultsForSelling = ALL_VAULT_LOCATIONS // Placeholder
  // const availableVaultsForSelling = userHoldingsInVaults?.length ? userHoldingsInVaults : ALL_VAULT_LOCATIONS;

  if (!isMounted) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="h-[500px] w-full animate-pulse bg-muted-foreground/10 rounded-md"></div>
        </CardContent>
      </Card>
    )
  }

  const currentVaultList = activeTab === "buy" ? ALL_VAULT_LOCATIONS : availableVaultsForSelling

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy {metalSymbol}</TabsTrigger>
            <TabsTrigger value="sell">Sell {metalSymbol}</TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="space-y-4 pt-4">
            <TradeFormContent
              key="buy-form"
              type="buy"
              currency={currency}
              setCurrency={setCurrency}
              fiatAmount={fiatAmount}
              setFiatAmount={setFiatAmount}
              weightAmount={weightAmount}
              setWeightAmount={setWeightAmount}
              unit={unit}
              setUnit={setUnit}
              selectedVault={selectedVault}
              setSelectedVault={setSelectedVault}
              vaultList={currentVaultList}
              onSubmit={handleSubmit}
            />
          </TabsContent>
          <TabsContent value="sell" className="space-y-4 pt-4">
            <TradeFormContent
              key="sell-form"
              type="sell"
              currency={currency}
              setCurrency={setCurrency}
              fiatAmount={fiatAmount}
              setFiatAmount={setFiatAmount}
              weightAmount={weightAmount}
              setWeightAmount={setWeightAmount}
              unit={unit}
              setUnit={setUnit}
              selectedVault={selectedVault}
              setSelectedVault={setSelectedVault}
              vaultList={currentVaultList}
              onSubmit={handleSubmit}
            />
            {activeTab === "sell" && availableVaultsForSelling.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">You do not hold this metal in any vault.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface TradeFormContentProps {
  type: "buy" | "sell"
  currency: string
  setCurrency: (c: any) => void
  fiatAmount: string
  setFiatAmount: (fa: string) => void
  weightAmount: string
  setWeightAmount: (wa: string) => void
  unit: string
  setUnit: (u: any) => void
  selectedVault: string
  setSelectedVault: (vId: string) => void
  vaultList: { id: string; name: string }[]
  onSubmit: () => void
}

function TradeFormContent({
  type,
  currency,
  setCurrency,
  fiatAmount,
  setFiatAmount,
  weightAmount,
  setWeightAmount,
  unit,
  setUnit,
  selectedVault,
  setSelectedVault,
  vaultList,
  onSubmit,
}: TradeFormContentProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 items-center">
        <Label htmlFor={`${type}-currency`} className="text-sm">
          In
        </Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger id={`${type}-currency`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${type}-fiat`} className="text-sm">
          Amount
        </Label>
        <Input
          id={`${type}-fiat`}
          type="number"
          placeholder="$0.00"
          value={fiatAmount}
          onChange={(e) => setFiatAmount(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${type}-weight`} className="text-sm">
          Quantity
        </Label>
        <div className="flex gap-2">
          <Input
            id={`${type}-weight`}
            type="number"
            placeholder="0"
            className="flex-grow"
            value={weightAmount}
            onChange={(e) => setWeightAmount(e.target.value)}
          />
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gram">grams</SelectItem>
              <SelectItem value="ounce">ounces</SelectItem>
              <SelectItem value="kilogram">kilos</SelectItem>
              <SelectItem value="pound">pounds</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${type}-vault`} className="text-sm flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          {type === "buy" ? "Store in Vault" : "Sell from Vault"}
        </Label>
        <Select value={selectedVault} onValueChange={setSelectedVault} disabled={vaultList.length === 0}>
          <SelectTrigger id={`${type}-vault`}>
            <SelectValue placeholder="Select vault location" />
          </SelectTrigger>
          <SelectContent>
            {vaultList.map((vault) => (
              <SelectItem key={vault.id} value={vault.id}>
                {vault.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        className="w-full bg-rh-green hover:bg-rh-green/90"
        onClick={onSubmit}
        disabled={
          (type === "sell" && vaultList.length === 0) ||
          !Number.parseFloat(fiatAmount) ||
          !Number.parseFloat(weightAmount)
        }
      >
        Review Order
      </Button>
      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <Info className="w-3 h-3" /> Trade executes at live spot price + markup.
      </p>
    </>
  )
}
