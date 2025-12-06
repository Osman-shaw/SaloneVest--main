"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface PriceData {
    [symbol: string]: {
        price: number
        change24h: number
        lastUpdated: number
    }
}

interface PriceFeedContextType {
    prices: PriceData
    isConnected: boolean
}

const PriceFeedContext = createContext<PriceFeedContextType>({
    prices: {},
    isConnected: false,
})

// Initial mock prices based on our startup list
const INITIAL_PRICES: PriceData = {
    "ESLR": { price: 10.50, change24h: 2.5, lastUpdated: Date.now() }, // Easy Solar
    "MNME": { price: 5.25, change24h: -1.2, lastUpdated: Date.now() }, // Monime
    "LFBL": { price: 15.00, change24h: 0.5, lastUpdated: Date.now() }, // LifeBlood
    "OSWD": { price: 8.75, change24h: 1.8, lastUpdated: Date.now() }, // Oswald's Tech
    "VULT": { price: 12.40, change24h: 3.2, lastUpdated: Date.now() }, // Vult
    "MSBI": { price: 6.80, change24h: -0.5, lastUpdated: Date.now() }, // Mosabi
    "SL50": { price: 100.00, change24h: 0.1, lastUpdated: Date.now() }, // Salone 50 Index
    "TBIL": { price: 98.50, change24h: 0.05, lastUpdated: Date.now() }, // Treasury Bills
    "FIB": { price: 102.20, change24h: 0.2, lastUpdated: Date.now() }, // Freetown Infra Bond
    "SNTV": { price: 4.50, change24h: -2.1, lastUpdated: Date.now() }, // SNTV
    "LMAG": { price: 7.90, change24h: 1.5, lastUpdated: Date.now() }, // Lion Mountain Ag
    "FCPL": { price: 25.00, change24h: 0.8, lastUpdated: Date.now() }, // Freetown Comm Plaza
    "SJFC": { price: 9.15, change24h: 1.1, lastUpdated: Date.now() }, // Sierra Juice Factory
    "TEL": { price: 18.30, change24h: 4.5, lastUpdated: Date.now() }, // Tacugama Eco-Lodge
    "KEMC": { price: 14.60, change24h: -1.5, lastUpdated: Date.now() }, // Kono Mining
}

export function PriceFeedProvider({ children }: { children: React.ReactNode }) {
    const [prices, setPrices] = useState<PriceData>(INITIAL_PRICES)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Simulate WebSocket connection
        setIsConnected(true)

        const interval = setInterval(() => {
            setPrices((prevPrices) => {
                const newPrices = { ...prevPrices }

                // Randomly update some prices to simulate market movement
                Object.keys(newPrices).forEach((symbol) => {
                    if (Math.random() > 0.7) { // Only update 30% of assets per tick
                        const currentPrice = newPrices[symbol].price
                        const volatility = 0.02 // 2% max change
                        const change = currentPrice * (Math.random() * volatility - (volatility / 2))

                        newPrices[symbol] = {
                            price: Number((currentPrice + change).toFixed(2)),
                            change24h: Number((newPrices[symbol].change24h + (Math.random() * 0.5 - 0.25)).toFixed(2)),
                            lastUpdated: Date.now()
                        }
                    }
                })

                return newPrices
            })
        }, 3000) // Update every 3 seconds

        return () => {
            clearInterval(interval)
            setIsConnected(false)
        }
    }, [])

    return (
        <PriceFeedContext.Provider value={{ prices, isConnected }}>
            {children}
        </PriceFeedContext.Provider>
    )
}

export const usePriceFeed = () => useContext(PriceFeedContext)
