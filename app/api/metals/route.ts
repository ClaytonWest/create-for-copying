// Mock API to get a list of all metals for the watchlist
export async function GET() {
  const metals = [
    { symbol: "XAU", name: "Gold", price: 2350.55, change: 1.25 },
    { symbol: "XAG", name: "Silver", price: 29.75, change: -0.55 },
    { symbol: "XPT", name: "Platinum", price: 1050.2, change: 2.1 },
    { symbol: "XPD", name: "Palladium", price: 980.0, change: -1.15 },
  ]

  // Add slight random fluctuations
  const updatedMetals = metals.map((metal) => ({
    ...metal,
    price: Number.parseFloat((metal.price + (Math.random() - 0.5) * (metal.price * 0.01)).toFixed(2)),
    change: Number.parseFloat((metal.change + (Math.random() - 0.5) * 0.1).toFixed(2)),
  }))

  return Response.json(updatedMetals)
}
