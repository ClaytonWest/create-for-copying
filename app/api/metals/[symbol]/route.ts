// Mock API to get detailed data for a specific metal, including historical data
function generateHistoricalData(basePrice: number, days: number) {
  const data = []
  let price = basePrice
  const now = new Date()
  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(now.getDate() - (days - 1 - i))
    price += (Math.random() - 0.49) * (price * 0.02)
    data.push({ date: date.toISOString().split("T")[0], price: Number.parseFloat(price.toFixed(2)) })
  }
  return data
}

export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase()
  const metals: { [key: string]: any } = {
    XAU: { name: "Gold", price: 2350.55, change: 1.25, changePercent: 0.05 },
    XAG: { name: "Silver", price: 29.75, change: -0.16, changePercent: -0.55 },
    XPT: { name: "Platinum", price: 1050.2, change: 21.8, changePercent: 2.1 },
    XPD: { name: "Palladium", price: 980.0, change: -11.4, changePercent: -1.15 },
  }

  if (!metals[symbol]) {
    return new Response("Not Found", { status: 404 })
  }

  const metalData = metals[symbol]
  const historicalData = {
    "1D": generateHistoricalData(metalData.price, 24).map((d, i) => ({ ...d, date: `${i}:00` })), // hourly
    "1W": generateHistoricalData(metalData.price, 7),
    "1M": generateHistoricalData(metalData.price, 30),
    "3M": generateHistoricalData(metalData.price, 90),
    "1Y": generateHistoricalData(metalData.price, 365),
    "5Y": generateHistoricalData(metalData.price, 365 * 5),
  }

  return Response.json({
    ...metalData,
    historical: historicalData,
  })
}
