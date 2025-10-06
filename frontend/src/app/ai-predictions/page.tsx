'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import debounce from 'lodash.debounce'

const CoinChart = dynamic(() => import('@/components/charts/CoinChart'), { ssr: false })

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

export default function AIPredictionsPage() {
  const [coin, setCoin] = useState('bitcoin')
  const [coins, setCoins] = useState<{ id: string; symbol: string; name: string; image?: string }[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [timeframe, setTimeframe] = useState('1h')
  const [limit, setLimit] = useState(100)
  const [candles, setCandles] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<string>('')
  const [loadingChart, setLoadingChart] = useState<boolean>(false)
  const [coinSummary, setCoinSummary] = useState<CoinSummary | null>(null)

  // Ambil daftar coin
  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&order=market_cap_desc&per_page=200&page=1&sparkline=false'
        )
        const data = await res.json()
        setCoins(data)
      } catch (err) {
        console.error('Gagal load coins:', err)
      }
    }
    fetchCoins()
  }, [])

  // Ambil ringkasan harga coin saat coin berubah
  useEffect(() => {
    async function fetchCoinSummary() {
      if (!coin) return
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}`)
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
      } catch (err) {
        console.error(err)
      }
    }
    fetchCoinSummary()
  }, [coin])

  const timeframeMap: Record<string, string> = {
    '5m': '1',
    '15m': '1',
    '1h': '1',
    '4h': '7',
    '1d': '30',
    '1y': '365',
  }

  // Fetch OHLC
  useEffect(() => {
    async function fetchCandles() {
      if (!coin) return
      setLoadingChart(true)
      try {
        const days = timeframeMap[timeframe] || '1'
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}/ohlc?vs_currency=idr&days=${days}`
        )
        const data = await res.json()
        const parsed = data.slice(-limit).map((d: any) => ({
          time: Math.floor(d[0] / 1000),
          open: d[1],
          high: d[2],
          low: d[3],
          close: d[4],
        }))
        setCandles(parsed)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingChart(false)
      }
    }

    fetchCandles()
  }, [coin, timeframe, limit])

  // Analisis AI
  async function handleAnalysis() {
    setAnalysis('⏳ Sedang menganalisis...')
    try {
      const res = await fetch('/api/gemini/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coin, candles, timeframe, limit }),
      })
      const data = await res.json()
      if (data.analysis) setAnalysis(data.analysis)
      else setAnalysis('⚠️ Gagal mendapatkan analisis.')
    } catch (err: any) {
      setAnalysis('Error: ' + err.message)
    }
  }

  // Debounce search
  const [filteredCoins, setFilteredCoins] = useState(coins)
  const handleSearch = debounce((term: string) => {
    if (!term) {
      setFilteredCoins(coins)
      return
    }
    const filtered = coins.filter(
      (c) => c.name.toLowerCase().includes(term.toLowerCase()) || c.symbol.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredCoins(filtered)
  }, 200)

  useEffect(() => {
    handleSearch(searchTerm)
  }, [searchTerm, coins])

  const highlightText = (text: string, term: string) => {
    if (!term) return text
    const regex = new RegExp(`(${term})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-600 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Crypto Predictions</h1>

      {/* Search + Controls */}
      <div className="flex flex-wrap gap-4 items-center relative">
        <div className="w-full sm:w-auto relative">
          <input
            type="text"
            placeholder="Search coin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-white w-full sm:w-64"
          />
          {searchTerm && filteredCoins.length > 0 && (
            <ul className="absolute z-50 top-full mt-1 left-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow max-h-64 overflow-y-auto">
              {filteredCoins.slice(0, 10).map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setCoin(c.id)
                    setSearchTerm('')
                  }}
                >
                  {c.image && <Image src={c.image} alt={c.name} width={20} height={20} />}
                  <span className="font-medium">{highlightText(c.symbol.toUpperCase(), searchTerm)}</span> -{' '}
                  <span>{highlightText(c.name, searchTerm)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-white w-full sm:w-auto"
        >
          <option value="5m">5 Menit</option>
          <option value="15m">15 Menit</option>
          <option value="1h">1 Jam</option>
          <option value="4h">4 Jam</option>
          <option value="1d">1 Hari</option>
          <option value="1y">1 Tahun</option>
        </select>

        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-white w-full sm:w-auto"
        >
          {[100, 200, 300, 400, 500, 1000].map((val) => (
            <option key={val} value={val}>
              {val} Candle
            </option>
          ))}
        </select>
      </div>

      {/* Coin Summary */}
      {coinSummary && (
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-4 rounded shadow mt-4">
          <div className="flex items-center gap-3">
            <Image src={coinSummary.image} alt={coinSummary.name} width={40} height={40} className="rounded-full" />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-gray-100">{coinSummary.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">{coinSummary.symbol}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-3 md:mt-0 text-sm text-gray-700 dark:text-gray-300">
            <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              Last: IDR {coinSummary.current_price.toLocaleString('id-ID')}
            </div>
            <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              Low: IDR {coinSummary.low_24h.toLocaleString('id-ID')}
            </div>
            <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              High: IDR {coinSummary.high_24h.toLocaleString('id-ID')}
            </div>
            <div className="px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
              MC: IDR {coinSummary.market_cap.toLocaleString('id-ID')}
            </div>
            <div
              className={`px-3 py-2 border rounded-lg flex items-center gap-1 ${
                coinSummary.price_change_percentage_24h >= 0
                  ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-50 border-red-400 text-red-700 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {coinSummary.price_change_percentage_24h >= 0 ? '▲' : '▼'}{' '}
              {coinSummary.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {/* Chart + Analysis */}
      <div className="flex flex-col md:flex-row gap-4 mt-4 relative">
        <div className="flex-1 border rounded p-4 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-x-auto relative">
          {loadingChart && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-10">
              <div className="loader border-4 border-t-blue-500 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
            </div>
          )}
          <CoinChart coinId={coin} vsCurrency="idr" timeframe={timeframe} />
        </div>

        <div className="flex-1 border rounded p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold mb-2">📊 Hasil Analisis AI:</h2>
            <p className="whitespace-pre-line">{analysis}</p>
          </div>
          <button
            onClick={handleAnalysis}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-4 self-start"
          >
            Analisis AI
          </button>
        </div>
      </div>

      <style jsx>{`
        .loader {
          border-top-color: #3b82f6;
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
