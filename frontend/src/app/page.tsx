'use client'

import { useState } from "react"
import dynamic from "next/dynamic"
import MarketTable from "@/components/market/MarketTable"
import TrendingCarousel from "@/components/header/TrendingCarousel"
import NewsCarousel from "@/components/header/NewsCarousel"
import Link from "next/link"
import Attribution from "@/components/attribution/Attribution"

// dynamic import chart components
const PredictionChart = dynamic(() => import("@/components/charts/PredictionChart"), { ssr: false })
const CoinChart = dynamic(() => import("@/components/charts/CoinChart"), { ssr: false })

export default function DashboardPage() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const isAuthenticated = false // Ganti dengan logika autentikasi yang sebenarnya

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 min-h-screen">
      {/* Trending Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <TrendingCarousel />
      </div>

      {/* Market Section */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Markets</h2>
          <MarketTable pair="IDR" onCoinSelect={setSelectedCoin} />
        </div>
      </section>

      {/* Coin Chart Section */}
      {selectedCoin && (
        <section className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {selectedCoin.toUpperCase()} Price Chart
            </h2>
            <CoinChart coinId={selectedCoin} vsCurrency="idr" />
          </div>
        </section>
      )}

      {/* AI Prediction & Trade Engine Side by Side */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
            {/* AI Prediction */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                AI Predictions
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                AI Predictions utilize advanced machine learning algorithms to analyze historical and real-time market data, providing forecasts on potential price movements and market trends for selected cryptocurrencies.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                AI-powered insights to help you anticipate market movements.
              </p>
              {isAuthenticated ? (
                selectedCoin ? (
                  <PredictionChart coinId={selectedCoin} />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">
                    Please select a coin to see predictions.
                  </p>
                )
              ) : (
                <div className="text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Please log in to view detailed AI predictions.
                  </p>
                  <Link
                    href="/auth/login"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>

            {/* Trade Engine */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Trade Engine
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                The Trade Engine is an automated trading platform that allows users to simulate trading strategies, backtest them with historical data, and execute trades in real-time based on predefined rules and market conditions.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                Access our automated trade engine to simulate strategies and execute trades.
              </p>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/trade-engine"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Open Trade Engine
                  </Link>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Please log in to access the Trade Engine.
                  </p>
                  <Link
                    href="/auth/login"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* News Carousel */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 overflow-x-hidden">
          <NewsCarousel />
        </div>
      </section>

      {/* Attribution (at the bottom, above footer) */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Attribution />
        </div>
      </section>
    </div>
  )
}