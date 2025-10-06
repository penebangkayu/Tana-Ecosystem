'use client'

import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const CoinChart = dynamic(() => import('@/components/charts/CoinChart'), { ssr: false })
const CoinNews = dynamic(() => import('@/components/news/NewsList'), { ssr: false })

interface CoinSummary {
  image: string
  name: string
  symbol: string
  current_price: number
  low_24h: number
  high_24h: number
  market_cap: number
  price_change_percentage_24h: number
}

export default function CoinPage() {
  const params = useParams()
  const { id } = params
  const router = useRouter()

  const [coinSummary, setCoinSummary] = useState<CoinSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '30D' | '1Y'>('30D')

  // Fetch coin summary
  useEffect(() => {
    const fetchCoinSummary = async () => {
      try {
        const coinId = Array.isArray(id) ? id[0] : id;
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id.toLowerCase()}`)
        const data = await res.json()
        setCoinSummary({
          image: data.image.small,
          name: data.name,
          symbol: data.symbol,
          current_price: data.market_data.current_price.idr,
          low_24h: data.market_data.low_24h.idr,
          high_24h: data.market_data.high_24h.idr,
          market_cap: data.market_data.market_cap.idr,
          price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        })
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    fetchCoinSummary()
  }, [id])

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value as '1D' | '7D' | '30D' | '1Y')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Button kembali */}
      <button
        onClick={() => router.push('/')}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        <span className="mr-2">←</span>
        Kembali
      </button>

      {/* Chart Header */}
      {coinSummary && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded shadow">
          {/* Kiri: Logo + Nama */}
          <div className="flex items-center gap-3 mb-4 md:mb-0 w-full md:w-auto">
            <Image src={coinSummary.image} alt={coinSummary.name} width={40} height={40} className="rounded-full" />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-gray-100">{coinSummary.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">{coinSummary.symbol}</span>
            </div>
          </div>

          {/* Kanan: Ringkasan harga responsif */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row md:items-center md:gap-4 gap-2 w-full md:w-auto">
            <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-center">
              Last: IDR {coinSummary.current_price.toLocaleString('id-ID')}
            </div>
            <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-center">
              Low: IDR {coinSummary.low_24h.toLocaleString('id-ID')}
            </div>
            <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-center">
              High: IDR {coinSummary.high_24h.toLocaleString('id-ID')}
            </div>
            <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-center">
              MC: IDR {coinSummary.market_cap.toLocaleString('id-ID')}
            </div>
            <div
              className={`px-3 py-2 border rounded-lg flex items-center justify-center gap-1 ${
                coinSummary.price_change_percentage_24h >= 0
                  ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-50 border-red-400 text-red-700 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {coinSummary.price_change_percentage_24h >= 0 ? '▲' : '▼'}{' '}
              {coinSummary.price_change_percentage_24h.toFixed(2)}%
            </div>

            {/* Dropdown Timeframe */}
            <select
              value={timeframe}
              onChange={handleTimeframeChange}
              className="col-span-2 md:col-auto mt-2 md:mt-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1D">1D</option>
              <option value="7D">7D</option>
              <option value="30D">30D</option>
              <option value="1Y">1Y</option>
            </select>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded shadow w-full">
        <CoinChart coinId={id} vsCurrency="idr" timeframe={timeframe} />
      </section>

      {/* NewsList Section */}
      <section className="w-full bg-white dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 shadow">
        <div className="max-w-4xl w-full mx-0 px-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Related News</h2>
          <div className="w-full">
            <CoinNews />
          </div>
        </div>
      </section>
    </div>
  )
}
