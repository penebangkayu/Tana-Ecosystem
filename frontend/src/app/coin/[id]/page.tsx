'use client'

import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const CoinChart = dynamic(() => import('@/components/charts/CoinChart'), { ssr: false })
const CoinNews = dynamic(() => import('@/components/news/NewsList'), { ssr: false })

export default function CoinPage() {
  const params = useParams()
  const { id } = params

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link href="/" className="text-blue-500 hover:underline">
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{id.toUpperCase()}</h1>

      {/* Chart Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded shadow w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Price Chart (30 days)</h2>
        <CoinChart coinId={id} vsCurrency="idr" />
      </section>

      {/* NewsList Section full-width background dan border */}
      <section className="w-full bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 shadow">
        <div className="max-w-4xl w-full mx-0 px-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Related News</h2>

          {/* NewsList container full-width untuk border row */}
          <div className="w-full">
            <CoinNews />
          </div>
        </div>
      </section>
    </div>
  )
}
