"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import MarketTable from "@/components/market/MarketTable"
import TrendingCarousel from "@/components/header/TrendingCarousel"
import NewsCarousel from "@/components/header/NewsCarousel"
import Link from "next/link"

// dynamic import chart components
const PredictionChart = dynamic(
  () => import("@/components/charts/PredictionChart"),
  { ssr: false }
)
const CoinChart = dynamic(() => import("@/components/charts/CoinChart"), { ssr: false })

export default function DashboardPage() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 min-h-screen">
      {/* Trending Carousel */}
      <div className="px-4 sm:px-6 md:px-8">
        <TrendingCarousel />
      </div>

      {/* Market Section */}
      <section>
        <div className="px-4 sm:px-6 md:px-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Markets</h2>
        </div>
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

      {/* AI Prediction & Trade Engine Side by Side */}
      <section className="px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
          {/* AI Prediction */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              AI Predictions
            </h2>
            {selectedCoin ? (
              <PredictionChart coinId={selectedCoin} />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                Pilih coin di Market Table untuk melihat prediksi AI.
              </p>
            )}
            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
              AI memprediksi pergerakan harga berdasarkan data historis dan analisis pasar.
            </p>
          </div>

          {/* Trade Engine */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Trade Engine
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm">
              Trade Engine – Solusi Trading Otomatis Berbasis AI
Trade Engine adalah sistem trading otomatis yang dikembangkan dengan teknologi Artificial Intelligence (AI) untuk menghadirkan keputusan trading yang tepat, aman, dan konsisten.
Dengan analisis data pasar real-time, Trade Engine membantu Anda mengoptimalkan strategi, mengurangi risiko, dan meningkatkan peluang keuntungan secara berkelanjutan.

Klik tombol di bawah untuk mengakses halaman Trade Engine secara lengkap:
            </p>
            <Link
              href="/trade-engine"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Open Trade Engine
            </Link>
          </div>
        </div>
      </section>

      {/* News Carousel */}
      <div className="px-4 sm:px-6 md:px-8">
        <NewsCarousel />
      </div>
    </div>
  )
}
