'use client'

import { useEffect, useRef, useState } from 'react'
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
  UTCTimestamp,
  CrosshairMode,
} from 'lightweight-charts'

interface PredictionChartProps {
  coinId?: string
}

export default function PredictionChart({ coinId: externalCoinId }: PredictionChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [coinId, setCoinId] = useState<string>(externalCoinId || 'bitcoin')
  const [coins, setCoins] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    if (externalCoinId) {
      setCoinId(externalCoinId)
    }
  }, [externalCoinId])

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/list')
        const data = await res.json()
        setCoins(data)
      } catch (error) {
        console.error('Gagal mengambil daftar koin:', error)
      }
    }
    fetchCoins()
  }, [])

  useEffect(() => {
    if (!chartContainerRef.current) return
    const container = chartContainerRef.current

    const chartOptions: any = {
      width: container.clientWidth,
      height: 400,
      layout: {
        background: { color: '#181818' },
        textColor: '#f3f4f6',
      },
      grid: {
        vertLines: { color: '#333' },
        horzLines: { color: '#333' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#555' },
      timeScale: { borderColor: '#555', timeVisible: true },
    }

    const chart = createChart(container, chartOptions as any)
    chartRef.current = chart

    const candleSeries: ISeriesApi<'Candlestick'> = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })
    const lineSeries: ISeriesApi<'Line'> = chart.addLineSeries({ color: '#a885ff', lineWidth: 2 })

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=1`
        )
        const data: [number, number, number, number, number][] = await res.json()
        if (!data || !Array.isArray(data)) return

        const candles: CandlestickData<UTCTimestamp>[] = data.map(
          ([time, open, high, low, close]) => ({
            time: Math.floor(time / 1000) as UTCTimestamp,
            open,
            high,
            low,
            close,
          })
        )
        candleSeries.setData(candles)

        const last = candles[candles.length - 1]
        if (last) {
          const mock: LineData<UTCTimestamp>[] = Array.from({ length: 20 }, (_, i) => ({
            time: ((last.time as number) + (i + 1) * 60) as UTCTimestamp,
            value: last.close * (1 + (Math.random() - 0.5) * 0.01),
          }))
          lineSeries.setData(mock)
        } else {
          lineSeries.setData([])
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth })
    })
    resizeObserver.observe(container)

    return () => {
      chart.remove()
      resizeObserver.disconnect()
    }
  }, [coinId])

  return (
    <div>
      {!externalCoinId && (
        <div className="mb-4">
          <label className="mr-2 font-semibold text-gray-200">Pilih Koin:</label>
          <select
            className="border rounded px-2 py-1 bg-[#181818] text-gray-100 border-gray-700"
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        ref={chartContainerRef}
        className="w-full h-[400px] rounded border border-[#181818] bg-[#181818]"
      />
    </div>
  )
}
