import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Logo } from "./logo" // Import the updated Logo

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center">
        {" "}
        {/* Increased height for better logo fit */}
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo showWordmark={false} iconClassName="h-7 w-auto" /> {/* Use Logo, hide wordmark for concise header */}
          </Link>
          <div className="relative w-full max-w-sm items-center hidden md:flex">
            {" "}
            {/* Hide search on small screens */}
            <Input type="text" placeholder="Search" className="pl-10" />
            <span className="absolute start-0 inset-y-0 flex items-center justify-center px-3">
              <svg
                className="w-4 h-4 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          {" "}
          {/* Adjusted spacing */}
          <nav className="flex items-center space-x-3 sm:space-x-6 text-sm font-medium">
            <Link href="#" className="text-foreground/60 transition-colors hover:text-foreground/80 text-xs sm:text-sm">
              Home<br>
            </Link>
            <Link
              href="/portfolio"
              className="text-foreground/80 transition-colors hover:text-foreground text-xs sm:text-sm"
            >
              Investing
            </Link>
            
          </nav>
        </div>
      </div>
    </header>
  )
}
