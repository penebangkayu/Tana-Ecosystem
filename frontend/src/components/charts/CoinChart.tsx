'use client'

import { useEffect, useRef } from 'react'
import { createChart, CrosshairMode, ISeriesApi, LineStyle } from 'lightweight-charts'

interface CoinChartProps {
  coinId: string
  vsCurrency?: string
}

export default function CoinChart({ coinId, vsCurrency = 'idr' }: CoinChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#ffffff',
        textColor: document.documentElement.classList.contains('dark') ? '#f7f7f7' : '#111827',
      },
      grid: {
        vertLines: { color: '#e0e0e0' },
        horzLines: { color: '#e0e0e0' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#ccc',
      },
      timeScale: {
        borderColor: '#ccc',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    chartRef.current = chart

    const candleSeries = chart.addCandlestickSeries()
    candleSeriesRef.current = candleSeries

    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      scaleMargins: { top: 0.8, bottom: 0 },
    })
    volumeSeriesRef.current = volumeSeries

    // Fetch OHLC data from CoinGecko
    const fetchOHLC = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=${vsCurrency}&days=30`
        )
        const data: [number, number, number, number, number][] = await res.json()
        // data: [timestamp, open, high, low, close]

        const candleData = data.map(d => ({
          time: Math.floor(d[0] / 1000),
          open: d[1],
          high: d[2],
          low: d[3],
          close: d[4],
        }))

        const volumeData = data.map(d => ({
          time: Math.floor(d[0] / 1000),
          value: d[4] - d[1],
          color: d[4] - d[1] > 0 ? 'green' : 'red',
        }))

        candleSeries.setData(candleData)
        volumeSeries.setData(volumeData)
      } catch (err) {
        console.error(err)
      }
    }

    fetchOHLC()

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [coinId, vsCurrency])

  return <div ref={chartContainerRef} className="w-full" />
}
