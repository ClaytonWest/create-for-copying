// Mock API to get portfolio details
export async function GET() {
  const portfolio = {
    totalValue: 12129.54,
    todayChangeValue: 520.62,
    todayChangePercent: 4.14,
    positions: [
      {
        symbol: "XAU",
        equity: 8500.0,
        quantity: 3.616, // in ounces
        unit: "ounce",
        averageCost: 2150.75,
        todayReturn: 350.1,
        todayReturnPercent: 4.29,
        totalReturn: 725.0,
        totalReturnPercent: 9.32,
        portfolioDiversity: 70.08,
      },
      // ... other positions
    ],
  }
  return Response.json(portfolio)
}
