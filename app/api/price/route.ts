export const runtime = "edge"

let basePrice = 62.5 // Base price in USD per gram

export async function GET() {
  // Simulate small price fluctuations
  basePrice += (Math.random() - 0.5) * 0.15 // Fluctuate by up to $0.075
  if (basePrice < 60) basePrice = 60.25 // Ensure price stays within a reasonable range
  if (basePrice > 65) basePrice = 64.75

  return Response.json({
    price: Number.parseFloat(basePrice.toFixed(2)),
    currency: "USD",
    unit: "gram", // This API always returns price per gram
    timestamp: Date.now(),
  })
}
