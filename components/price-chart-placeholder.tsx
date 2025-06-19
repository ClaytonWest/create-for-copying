import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PriceChartPlaceholder() {
  return (
    <Card className="w-full bg-navy/80 border-gold/50 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-gold">24-Hour Price Trend</CardTitle>
        <CardDescription className="text-gray-300">Illustrative data. For demonstration purposes only.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-[16/6] bg-navy/60 rounded-md flex items-center justify-center p-4">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 100"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 60 Q 37.5 30, 75 60 T 150 60 Q 187.5 90, 225 60 T 300 60"
              stroke="url(#goldGradient)"
              strokeWidth="2.5"
              fill="none"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#D4AF37", stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: "#F0D060", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#D4AF37", stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="#D4AF37"
              fontSize="12"
              className="opacity-60 font-sans"
            >
              Illustrative Price Chart
            </text>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
