'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CandlestickChart } from '@/components/charts/CandlestickChart'
import { fetchMarketHistory } from '@/lib/coingecko'

export default function MarketDetailPage() {
  const params = useParams()
  const symbol = params.symbol
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getHistory = async () => {
      try {
        const data = await fetchMarketHistory(symbol)
        setHistory(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch market history')
      } finally {
        setLoading(false)
      }
    }
    getHistory()
  }, [symbol])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{symbol?.toUpperCase()} Chart</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <CandlestickChart data={history} />}
    </div>
  )
}
