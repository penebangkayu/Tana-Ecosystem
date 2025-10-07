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
  coinId?: string // biar bisa dikasih dari luar, tapi default tetap "bitcoin"
}

export default function PredictionChart({ coinId: externalCoinId }: PredictionChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const [coinId, setCoinId] = useState<string>(externalCoinId || 'bitcoin')
  const [coins, setCoins] = useState<{ id: string; name: string }[]>([])

  // Update coinId kalau prop dari luar berubah
  useEffect(() => {
    if (externalCoinId) {
      setCoinId(externalCoinId)
    }
  }, [externalCoinId])

  useEffect(() => {
    // Ambil daftar koin dari CoinGecko API
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

    // NOTE: beberapa versi typing lightweight-charts ketat terhadap shape opsi.
    // Kita buat options lalu cast ke any saat memanggil createChart supaya kompatibel.
    const chartOptions: any = {
      width: container.clientWidth,
      height: 400,
      layout: {
        // gunakan bentuk yang lebih umum, tapi cast ke any saat createChart dipanggil
        background: { color: '#ffffff' },
        textColor: '#000000',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      crosshair: { mode: CrosshairMode.Normal },
    }

    // Inisialisasi chart (casting ke any untuk menghindari error typing yang berbeda beda)
    const chart = createChart(container, chartOptions as any)
    chartRef.current = chart

    const candleSeries: ISeriesApi<'Candlestick'> = chart.addCandlestickSeries()
    const lineSeries: ISeriesApi<'Line'> = chart.addLineSeries({ color: 'red', lineWidth: 2 })

    // Ambil data OHLC dan prediksi
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=1`
        )
        const data: [number, number, number, number, number][] = await res.json()
        if (!data || !Array.isArray(data)) return

        // Pastikan time sesuai dengan UTCTimestamp type (casting aman)
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

        // Mock prediksi ±0.5% dari close terakhir
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
      {/* Dropdown koin (aktif hanya jika tidak dikontrol dari luar) */}
      {!externalCoinId && (
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
      )}

      {/* Kontainer chart */}
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  )
}
