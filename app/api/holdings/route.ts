export const runtime = "edge"

export async function GET() {
  // Mock holdings data
  // In a real app, valuePerUnit would likely be fetched or calculated based on live prices
  const holdings = [
    { id: "gold001", metal: "Gold", quantity: 150.5, unit: "gram", valuePerUnit: 62.75, vault: "Zurich Vault" },
    { id: "silver001", metal: "Silver", quantity: 5000, unit: "gram", valuePerUnit: 0.85, vault: "London Vault" },
    { id: "platinum001", metal: "Platinum", quantity: 50.0, unit: "gram", valuePerUnit: 30.2, vault: "New York Vault" },
    { id: "gold002", metal: "Gold", quantity: 25.0, unit: "ounce", valuePerUnit: 1950.5, vault: "Singapore Vault" }, // Example with ounces
  ]
  return Response.json(holdings)
}
