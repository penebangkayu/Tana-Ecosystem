"use client"

import { useEffect, useRef, useState } from "react"
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData } from "lightweight-charts"

export default function PredictionChart() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [coinId, setCoinId] = useState<string>("bitcoin")
  const [coins, setCoins] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    // Ambil daftar koin dari CoinGecko API
    const fetchCoins = async () => {
      try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/list")
        const data = await res.json()
        setCoins(data)
      } catch (error) {
        console.error("Gagal mengambil daftar koin:", error)
      }
    }

    fetchCoins()
  }, [])

  useEffect(() => {
    if (!chartContainerRef.current) return
    const container = chartContainerRef.current

    // Inisialisasi chart
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 400,
      layout: { backgroundColor: "#fff", textColor: "#000" },
      grid: { vertLines: { color: "#eee" }, horzLines: { color: "#eee" } },
      crosshair: { mode: 1 },
    })
    chartRef.current = chart

    const candleSeries: ISeriesApi<"Candlestick"> = chart.addCandlestickSeries()
    const lineSeries: ISeriesApi<"Line"> = chart.addLineSeries({ color: "red", lineWidth: 2 })

    // Ambil data OHLC
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=1`
        )
        const data: [number, number, number, number, number][] = await res.json()
        if (!data) return

        const candles: CandlestickData[] = data.map(([time, open, high, low, close]) => ({
          time: Math.floor(time / 1000),
          open,
          high,
          low,
          close,
        }))
        candleSeries.setData(candles)

        // Mock prediksi ±0.5% dari close terakhir
        const last = candles[candles.length - 1]
        const mock: LineData[] = Array.from({ length: 20 }, (_, i) => ({
          time: last.time + (i + 1) * 60,
          value: last.close * (1 + (Math.random() - 0.5) * 0.01),
        }))
        lineSeries.setData(mock)
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()

    // Responsif
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
      {/* Dropdown koin */}
      <div className="mb-4">
        <label className="mr-2 font-semibold text-gray-800 dark:text-gray-200">Pilih Koin:</label>
        <select
          className="border rounded px-2 py-1"
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

      {/* Kontainer chart */}
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  )
}
