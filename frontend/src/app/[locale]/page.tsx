'use client'

import { useState } from "react"
import dynamic from "next/dynamic"
import MarketTable from "@/components/market/MarketTable"
import TrendingCarousel from "@/components/header/TrendingCarousel"
import NewsCarousel from "@/components/header/NewsCarousel"
import Link from "next/link"
import Attribution from "@/components/attribution/Attribution"
import { useTranslations } from "next-intl"

// dynamic import chart components
const PredictionChart = dynamic(() => import("@/components/charts/PredictionChart"), { ssr: false })
const CoinChart = dynamic(() => import("@/components/charts/CoinChart"), { ssr: false })

export default function DashboardPage() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const t = useTranslations("dashboard")

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 min-h-screen">
      {/* Trending Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <TrendingCarousel />
      </div>

      {/* Market Section */}
      <section className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t("markets")}</h2>
          <MarketTable pair="IDR" onCoinSelect={setSelectedCoin} />
        </div>
      </section>

      {/* Coin Chart Section */}
      {selectedCoin && (
        <section className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {t("priceChart", { coin: selectedCoin.toUpperCase() })}
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
                {t("aiPredictions")}
              </h2>
              {selectedCoin ? (
                <PredictionChart coinId={selectedCoin} />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{t("aiSelectCoin")}</p>
              )}
              <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">{t("aiDescription")}</p>
            </div>

            {/* Trade Engine */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t("tradeEngine")}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ whiteSpace: "pre-line" }}>
                {t("tradeDescription")}
              </p>
              <Link
                href="/trade-engine"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {t("openTradeEngine")}
              </Link>
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
