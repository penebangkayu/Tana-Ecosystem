'use client'

import { useEffect, useState } from 'react'
import CandlestickChart from '@/components/charts/CandlestickChart'

export default function AIPredictionsPage() {
  const [coin, setCoin] = useState('bitcoin')
  const [coins, setCoins] = useState<{ id: string; symbol: string; name: string; image?: string }[]>([])
  const [timeframe, setTimeframe] = useState('1h')
  const [limit, setLimit] = useState(100)
  const [candles, setCandles] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<string>('')

  // Fetch coins realtime dari CoinGecko (pakai endpoint market biar ada logo)
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

  // Mapping timeframe ke days (CoinGecko OHLC param)
  const timeframeMap: Record<string, string> = {
    '5m': '1',
    '15m': '1',
    '1h': '1',
    '4h': '7',
    '1d': '30',
    '1y': '365',
  }

  // Fetch candles setiap coin/timeframe berubah
  useEffect(() => {
    async function fetchCandles() {
      try {
        const days = timeframeMap[timeframe] || '1'
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coin}/ohlc?vs_currency=idr&days=${days}`
        )

        const data = await res.json()
        const parsed = data.slice(-limit).map((d: any) => ({
          time: Math.floor(d[0] / 1000), // biar cocok sama lightweight-charts
          open: d[1],
          high: d[2],
          low: d[3],
          close: d[4],
        }))
        setCandles(parsed)
      } catch (err) {
        console.error(err)
      }
    }

    if (coin) fetchCandles()
  }, [coin, timeframe, limit])

  // Kirim data candle ke AI untuk analisis
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Crypto Predictions</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Dropdown coins realtime (ada logo + ticker) */}
        <select
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
        >
          {coins.length === 0 ? (
            <option>Loading coins...</option>
          ) : (
            coins.map((c) => (
              <option key={c.id} value={c.id}>
                {c.symbol.toUpperCase()} - {c.name}
              </option>
            ))
          )}
        </select>

        {/* Dropdown timeframe */}
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="5m">5 Menit</option>
          <option value="15m">15 Menit</option>
          <option value="1h">1 Jam</option>
          <option value="4h">4 Jam</option>
          <option value="1d">1 Hari</option>
          <option value="1y">1 Tahun</option>
        </select>

        {/* Dropdown limit */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border p-2 rounded bg-white dark:bg-gray-800 dark:text-white"
        >
          {[100, 200, 300, 400, 500, 1000].map((val) => (
            <option key={val} value={val}>
              {val} Candle
            </option>
          ))}
        </select>

        <button
          onClick={handleAnalysis}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Analisis AI
        </button>
      </div>

      {/* Chart */}
      <div className="border rounded p-4 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CandlestickChart data={candles} />
      </div>

      {/* Analysis Result */}
      <div className="border rounded p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
        <h2 className="font-semibold mb-2">📊 Hasil Analisis AI:</h2>
        <p className="whitespace-pre-line">{analysis}</p>
      </div>
    </div>
  )
}
