'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ICandleSeriesApi } from 'lightweight-charts'

// Dummy function for AI prediction using Gemini API (replace with your key)
async function analyzeWithAI(symbol: string) {
  try {
    const res = await fetch(`https://api.gemini.com/v1/predict?symbol=${symbol}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.error('AI analysis error:', err)
    return null
  }
}

// Exchange options
const indodaxPairs = ['BTC/IDR', 'ETH/IDR', 'XRP/IDR']
const binancePairs = ['BTCUSDT', 'ETHUSDT']

export default function AiPredictionsPage() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ICandleSeriesApi | null>(null)

  const [selectedExchange, setSelectedExchange] = useState<'Indodax' | 'Binance'>('Indodax')
  const [selectedPair, setSelectedPair] = useState(indodaxPairs[0])
  const [candleData, setCandleData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiResult, setAiResult] = useState<any>(null)

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { backgroundColor: '#ffffff', textColor: '#000' },
      grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#ccc' },
      timeScale: { borderColor: '#ccc', timeVisible: true, secondsVisible: false },
    })

    const series = chart.addCandlestickSeries()
    chartRef.current = chart
    seriesRef.current = series

    return () => chart.remove()
  }, [])

  // Fetch candle data
  const fetchCandleData = async () => {
    setLoading(true)
    setError('')
    try {
      let data: any[] = []
      if (selectedExchange === 'Indodax') {
        const pairApi = selectedPair.toLowerCase().replace('/', '_')
        const res = await fetch(`https://indodax.com/api/${pairApi}/trades`)
        const json = await res.json()
        // Convert trades to OHLC per minute (simplified)
        data = json.trades.map((t: any) => ({
          time: Math.floor(t.date),
          open: parseFloat(t.price),
          high: parseFloat(t.price),
          low: parseFloat(t.price),
          close: parseFloat(t.price),
        }))
      } else {
        // Binance
        const symbol = selectedPair
        const interval = '1m'
        const limit = 100
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
        )
        const json = await res.json()
        data = json.map((d: any) => ({
          time: d[0] / 1000, // UNIX timestamp in seconds
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }))
      }

      setCandleData(data)
      if (seriesRef.current) seriesRef.current.setData(data)
    } catch (err: any) {
      console.error(err)
      setError('Failed to fetch candle data.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    const result = await analyzeWithAI(selectedPair)
    setAiResult(result)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">AI Predictions</h1>

      {/* Exchange & Pair Selection */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="border px-2 py-1"
          value={selectedExchange}
          onChange={(e) => {
            const val = e.target.value as 'Indodax' | 'Binance'
            setSelectedExchange(val)
            setSelectedPair(val === 'Indodax' ? indodaxPairs[0] : binancePairs[0])
          }}
        >
          <option value="Indodax">Indodax</option>
          <option value="Binance">Binance</option>
        </select>

        <select
          className="border px-2 py-1"
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
        >
          {(selectedExchange === 'Indodax' ? indodaxPairs : binancePairs).map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          onClick={fetchCandleData}
        >
          Load Candles
        </button>

        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          onClick={handleAnalyze}
        >
          Analyze AI
        </button>
      </div>

      {loading && <p>Loading candle data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div ref={chartContainerRef} className="w-full h-96 mb-4" />

      {aiResult && (
        <div className="bg-white p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">AI Result:</h2>
          <pre>{JSON.stringify(aiResult, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
