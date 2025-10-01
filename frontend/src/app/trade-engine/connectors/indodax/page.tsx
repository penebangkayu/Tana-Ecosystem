'use client'

import { useEffect, useState } from 'react'
import { fetchIndodaxMarket } from '@/lib/indodax'
import { MarketTable } from '@/components/market/MarketTable'

export default function IndodaxConnectorPage() {
  const [markets, setMarkets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getMarkets = async () => {
      try {
        const data = await fetchIndodaxMarket()
        setMarkets(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Indodax markets')
      } finally {
        setLoading(false)
      }
    }
    getMarkets()
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Indodax Connector</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && <MarketTable markets={markets} />}
    </div>
  )
}
