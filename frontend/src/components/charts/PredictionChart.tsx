"use client"

import { useEffect, useState } from "react"
import { createChart } from "lightweight-charts"

interface PredictionChartProps {
  coinId: string
}

export default function PredictionChart({ coinId }: PredictionChartProps) {
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!chartContainer) return

    const chart = createChart(chartContainer, { width: chartContainer.clientWidth, height: 400 })
    const lineSeries = chart.addLineSeries()

    const fetchData = async () => {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=1m`)
      const data = await res.json()
      const prices = data.prices.map((p: [number, number]) => ({
        time: Math.floor(p[0] / 1000), // convert ms → sec
        value: p[1]
      }))
      lineSeries.setData(prices)
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // refresh tiap 30 detik

    return () => {
      clearInterval(interval)
      chart.remove()
    }
  }, [coinId, chartContainer])

  return <div ref={setChartContainer} className="w-full h-[400px]" />
}
