'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import MarketTable from '@/components/market/MarketTable'
import TrendingCarousel from '@/components/header/TrendingCarousel'
import NewsCarousel from '@/components/header/NewsCarousel'
import Link from 'next/link'

// dynamic import chart component
const PredictionChart = dynamic(
  () => import('@/components/charts/PredictionChart'),
  { ssr: false }
)
const CoinChart = dynamic(
  () => import('@/components/charts/CoinChart'),
  { ssr: false }
)

export default function DashboardPage() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 min-h-screen">
      {/* Trending Carousel */}
      <div className="px-4 sm:px-6 md:px-8">
        <TrendingCarousel />
      </div>

      {/* Market Section */}
      <section className="">
        <div className="px-4 sm:px-6 md:px-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Markets</h2>
        </div>
        {/* MarketTable full width tanpa padding wrapper */}
        <MarketTable pair="IDR" onCoinSelect={setSelectedCoin} />
      </section>

      {/* Coin Chart Section */}
      {selectedCoin && (
        <section className="px-4 sm:px-6 md:px-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {selectedCoin.toUpperCase()} Price Chart
          </h2>
          <CoinChart coinId={selectedCoin} vsCurrency="idr" />
        </section>
      )}

      {/* AI Prediction Section */}
      <section className="px-4 sm:px-6 md:px-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">AI Predictions</h2>
        <PredictionChart />
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          AI memprediksi pergerakan harga berdasarkan data historis dan analisis pasar.
        </p>
      </section>

      {/* Trade Engine Section */}
      <section className="px-4 sm:px-6 md:px-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Trade Engine</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Klik tombol di bawah untuk membuka halaman Trade Engine lengkap:
        </p>
        <Link
          href="/trade-engine"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Open Trade Engine
        </Link>
      </section>

      {/* News Carousel */}
      <div className="px-4 sm:px-6 md:px-8">
        <NewsCarousel />
      </div>
    </div>
  )
}
