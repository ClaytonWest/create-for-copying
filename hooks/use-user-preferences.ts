"use client"
import { useState, useEffect } from "react"

type Unit = "gram" | "ounce" | "kilogram" | "pound"
type Currency = "USD" | "EUR" | "GBP"

const isServer = typeof window === "undefined"

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (isServer) {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (!isServer) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export function useUserPreferences() {
  const [unit, setUnit] = useLocalStorage<Unit>("preferredUnit", "ounce")
  const [currency, setCurrency] = useLocalStorage<Currency>("preferredCurrency", "USD")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return {
    unit,
    setUnit,
    currency,
    setCurrency,
    isMounted, // Use this to prevent SSR/hydration mismatches
  }
}
