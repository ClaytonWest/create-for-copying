"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast" // Assuming useToast is available

export function TradeForm() {
  const [amount, setAmount] = useState("")
  const [asset] = useState("gold") // Default asset
  const { toast } = useToast() // For user feedback

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, type: "buy" | "sell") => {
    event.preventDefault()
    // This is a placeholder. In a real app, you'd call an API.
    // const formData = new FormData(event.currentTarget);
    // formData.append('type', type);
    // formData.append('asset', asset);
    // formData.append('amount', amount);
    // const reserve = formData.get('reserve');
    // console.log(`Simulated ${type} order for ${amount} of ${asset} from/to ${reserve} reserve.`);

    toast({
      title: `Simulated ${type.charAt(0).toUpperCase() + type.slice(1)} Order`,
      description: `Your order to ${type} ${amount} grams of ${asset} has been placed (simulated).`,
      variant: "default", // Or "success" if you have such variant
      className: "bg-navy text-white border-gold",
    })
    setAmount("")
  }

  return (
    <Card className="w-full bg-navy/80 border-gold/50 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-gold">Trade Gold</CardTitle>
        <CardDescription className="text-gray-300">
          Select your reserve and place your order. (Simulated)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-navy border border-gold/50 mb-4">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-gold data-[state=active]:text-navy text-gray-300"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="data-[state=active]:bg-gold data-[state=active]:text-navy text-gray-300"
            >
              Sell
            </TabsTrigger>
          </TabsList>

          {(["buy", "sell"] as const).map((type) => (
            <TabsContent key={type} value={type}>
              <form onSubmit={(e) => handleSubmit(e, type)} className="space-y-6">
                <div>
                  <Label htmlFor={`${type}-amount`} className="text-gray-300 block mb-1.5">
                    Amount (grams)
                  </Label>
                  <Input
                    id={`${type}-amount`}
                    name="amount"
                    type="number"
                    placeholder="e.g., 100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="bg-navy border-gold/70 focus:ring-gold focus:ring-offset-0 text-white placeholder:text-gray-500"
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor={`${type}-reserve`} className="text-gray-300 block mb-1.5">
                    {type === "buy" ? "To Reserve Location" : "From Reserve Location"}
                  </Label>
                  <Select defaultValue="zurich" name="reserve">
                    <SelectTrigger
                      id={`${type}-reserve`}
                      className="bg-navy border-gold/70 focus:ring-gold focus:ring-offset-0 text-white"
                    >
                      <SelectValue placeholder="Select reserve" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy text-white border-gold/70">
                      <SelectItem value="zurich" className="hover:bg-gold/20 focus:bg-gold/20 cursor-pointer">
                        Zurich Vault
                      </SelectItem>
                      <SelectItem value="london" className="hover:bg-gold/20 focus:bg-gold/20 cursor-pointer">
                        London Vault
                      </SelectItem>
                      <SelectItem value="newyork" className="hover:bg-gold/20 focus:bg-gold/20 cursor-pointer">
                        New York Vault
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gold text-navy hover:bg-gold/90 font-semibold py-3 text-base"
                >
                  {type === "buy" ? "Buy Gold" : "Sell Gold"}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
