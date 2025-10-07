'use client'

import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  CrosshairMode,
  ISeriesApi,
  UTCTimestamp,
} from 'lightweight-charts'

interface CoinChartProps {
  coinId: string
  vsCurrency?: string
  timeframe?: '1D' | '7D' | '30D' | '1Y'
}

interface CoinInfo {
  name: string
  symbol: string
  description: Record<string, string>
  platforms: Record<string, string>
  links: {
    homepage: string[]
    blockchain_site: string[]
    official_forum_url: string[]
    twitter_screen_name?: string
    repos_url?: { github: string[] }
  }
  image: { small: string; thumb: string; large: string }
  market_data: { current_price: Record<string, number> }
}

export default function CoinChart({
  coinId,
  vsCurrency = 'idr',
  timeframe = '30D',
}: CoinChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  const [isDarkMode, setIsDarkMode] = useState(true)
  const [coinInfo, setCoinInfo] = useState<CoinInfo | null>(null)

  const getCoinGeckoParams = () => {
    switch (timeframe) {
      case '1D': return { days: 1, interval: 'minutely' }
      case '7D': return { days: 7, interval: 'hourly' }
      case '30D': return { days: 30, interval: 'daily' }
      case '1Y': return { days: 365, interval: 'daily' }
      default: return { days: 30, interval: 'daily' }
    }
  }

  const fetchOHLC = async () => {
    if (!candleSeriesRef.current) return
    try {
      const { days } = getCoinGeckoParams()
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=${vsCurrency}&days=${days}`
      )
      if (!res.ok) throw new Error('Failed to fetch OHLC')
      const data: [number, number, number, number, number][] = await res.json()
      const candleData = data.map(d => ({
        time: Math.floor(d[0] / 1000) as UTCTimestamp,
        open: d[1],
        high: d[2],
        low: d[3],
        close: d[4],
      }))
      candleSeriesRef.current.setData(candleData)
    } catch (err) {
      console.error('OHLC error:', err)
    }
  }

  const fetchCoinInfo = async () => {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
      if (!res.ok) throw new Error('Failed to fetch coin info')
      const data = await res.json()
      setCoinInfo(data)
    } catch (err) {
      console.error('Coin info error:', err)
    }
  }

  const applyDarkModeOptions = () => {
    if (!chartRef.current) return
    chartRef.current.applyOptions({
      layout: { background: { color: '#181818' }, textColor: '#f7f7f7' },
      grid: { vertLines: { color: '#333333' }, horzLines: { color: '#333333' } },
      rightPriceScale: { borderColor: '#181818' },
      timeScale: { borderColor: '#181818' },
    })
  }

  useEffect(() => { fetchCoinInfo() }, [coinId])

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: '#181818' }, textColor: '#f7f7f7' },
      grid: { vertLines: { color: '#333333' }, horzLines: { color: '#333333' } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#181818' },
      timeScale: { borderColor: '#181818', timeVisible: true },
    })

    chartRef.current = chart
    candleSeriesRef.current = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    })

    fetchOHLC()
    const intervalId = setInterval(fetchOHLC, 15000)
    const handleResize = () => {
      if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [coinId, vsCurrency, timeframe])

  useEffect(() => { applyDarkModeOptions(); fetchOHLC() }, [isDarkMode, timeframe])

  return (
    <div className="bg-[#181818] text-white rounded-lg p-4 shadow-lg border border-[#181818] transition-colors">
      {/* Chart */}
      <div
        ref={chartContainerRef}
        className="w-full h-[400px] rounded border border-[#181818] bg-[#181818] transition-colors"
      />

      {/* Coin Info */}
      {coinInfo && (
        <div className="mt-4 p-4 border rounded bg-[#1f1f1f] border-[#181818] shadow-sm max-h-[400px] overflow-y-auto transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <img src={coinInfo.image.small} alt={coinInfo.name} className="w-8 h-8" />
            <h2 className="font-bold text-lg text-white">
              {coinInfo.name} ({coinInfo.symbol.toUpperCase()})
            </h2>
          </div>
          <div className="text-sm text-gray-300 mb-2">
            <strong>Blockchain / Platform:</strong>{' '}
            {Object.keys(coinInfo.platforms)
              .filter(k => coinInfo.platforms[k])
              .join(', ') || 'N/A'}
          </div>
          <div className="text-sm text-gray-300 mb-2">
            <strong>Website:</strong>{' '}
            {coinInfo.links.homepage.filter(Boolean).join(', ') || 'N/A'}
          </div>
          <div className="text-sm text-gray-300 whitespace-pre-line">
            <strong>About:</strong> {coinInfo.description.en || 'No description available.'}
          </div>
        </div>
      )}
    </div>
  )
}
