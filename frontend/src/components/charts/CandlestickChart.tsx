'use client'

import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  CandlestickData,
} from 'lightweight-charts'

interface CandlestickChartProps {
  initialTicker?: string
}

const TICKERS = ['BTC/IDR', 'ETH/IDR', 'XRP/IDR']

export default function CandlestickChart({ initialTicker = 'BTC/IDR' }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<IChartApi | null>(null)
  const [series, setSeries] = useState<ISeriesApi<'Candlestick'> | null>(null)
  const [ticker, setTicker] = useState<string>(initialTicker)
  const [data, setData] = useState<CandlestickData[]>([])

  // Fetch dummy / real market data
  const fetchMarketData = async (symbol: string) => {
    // Contoh data dummy
    const now = Date.now()
    const dummyData: CandlestickData[] = []
    for (let i = 10; i >= 0; i--) {
      dummyData.push({
        time: Math.floor((now - i * 3600 * 1000) / 1000) as UTCTimestamp,
        open: Math.random() * 100 + 100,
        high: Math.random() * 100 + 150,
        low: Math.random() * 100 + 90,
        close: Math.random() * 100 + 100,
      })
    }
    return dummyData
  }

  useEffect(() => {
    if (!chartContainerRef.current) return

    const c = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      rightPriceScale: {
        borderColor: '#ccc',
      },
      timeScale: {
        borderColor: '#ccc',
        timeVisible: true,
      },
    })
    const s = c.addCandlestickSeries()
    setChart(c)
    setSeries(s)

    return () => c.remove()
  }, [])

  useEffect(() => {
    if (!series) return
    const loadData = async () => {
      const marketData = await fetchMarketData(ticker)
      setData(marketData)
      series.setData(marketData)
    }
    loadData()
  }, [series, ticker])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <label className="font-semibold">Select Ticker:</label>
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {TICKERS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  )
}
