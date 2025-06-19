export function AppFooter() {
  return (
    <footer className="bg-navy text-gray-400 py-8 border-t border-gold/20 mt-16">
      <div className="container mx-auto px-4 md:px-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Baliukonis. All rights reserved.</p>
        <p className="mt-2 max-w-3xl mx-auto">
          Trading physical gold and other precious metals involves risk. Prices can fluctuate. Past performance is not
          indicative of future results. Please consult with a financial advisor before making investment decisions.
        </p>
        <p className="mt-2">This is a demonstration MVP. No real transactions are processed.</p>
      </div>
    </footer>
  )
}
