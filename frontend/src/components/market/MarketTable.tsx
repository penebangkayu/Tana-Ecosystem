'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

interface Coin {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number
  image: string
  sparkline_in_7d?: {
    price: number[]
  }
}

interface MarketTableProps {
  pair?: string
}

export default function MarketTable({ pair = 'IDR' }: MarketTableProps) {
  const [coins, setCoins] = useState<Coin[]>([])
  const [allCoins, setAllCoins] = useState<Coin[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const fetchTopCoins = async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${pair.toLowerCase()}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`
      )
      const data = await res.json()
      // Log sparkline data for debugging
      console.log('Top coins data:', data.map((coin: Coin) => ({
        id: coin.id,
        sparkline: coin.sparkline_in_7d?.price?.length || 'No sparkline data'
      })))
      setCoins(data)
      setAllCoins(data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching top coins:', err)
      setLoading(false)
    }
  }

  const fetchSearchCoins = async (query: string) => {
    if (!query.trim()) {
      setCoins(allCoins)
      return
    }

    // Client-side filter
    const filtered = allCoins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
    )

    if (filtered.length > 0) {
      setCoins(filtered)
      return
    }

    // Fallback API fetch
    try {
      setLoading(true)
      const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`)
      const searchData = await searchRes.json()
      const ids = searchData.coins.map((c: any) => c.id).slice(0, 5)
      if (ids.length === 0) {
        setCoins([])
        setLoading(false)
        return
      }
      const marketRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${pair.toLowerCase()}&ids=${ids.join(
          ','
        )}&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h`
      )
      const marketData = await marketRes.json() // ✅ ganti dari 'res.json()' ke 'marketRes.json()'
      // Log sparkline data for debugging
      console.log('Search coins data:', marketData.map((coin: Coin) => ({
        id: coin.id,
        sparkline: coin.sparkline_in_7d?.price?.length || 'No sparkline data'
      })))
      setCoins(marketData)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching search coins:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopCoins()
    const interval = setInterval(() => {
      if (!search.trim()) fetchTopCoins()
    }, 60000)
    return () => clearInterval(interval)
  }, [pair])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSearchCoins(value)
    }, 200)
  }

  const clearSearch = () => {
    setSearch('')
    fetchTopCoins()
  }

  // Sparkline chart component
  const SparklineChart = ({ data, width = 80, height = 30, color }: { 
    data: number[], 
    width?: number, 
    height?: number, 
    color: string 
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas || !data || data.length < 2) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = width
      canvas.height = height
      ctx.clearRect(0, 0, width, height)

      const minValue = Math.min(...data)
      const maxValue = Math.max(...data)
      const range = maxValue - minValue || 1

      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'

      const stepX = width / (data.length - 1)
      data.forEach((value, index) => {
        const x = index * stepX
        const normalizedY = height - ((value - minValue) / range * (height - 2)) - 1
        const y = Math.max(1, Math.min(normalizedY, height - 1))
        if (index === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.fillStyle = `${color}20`
      ctx.fill()
    }, [data, width, height, color])

    if (!data || data.length < 2) {
      return (
        <div className="w-[80px] h-[30px] bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
          No data
        </div>
      )
    }

    return (
      <div className="flex justify-end">
        <canvas ref={canvasRef} width={width} height={height} className="rounded" />
      </div>
    )
  }

  if (loading) return <p className="text-gray-500 dark:text-gray-400 px-4">Loading market data...</p>
  if (coins.length === 0) return <p className="text-gray-500 dark:text-gray-400 px-4">No data found.</p>

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* Search Box */}
      <div className="px-4 relative">
        <input
          type="text"
          placeholder="Search coin..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 pr-10 rounded-full border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ×
          </button>
        )}
      </div>

      {/* Market Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto border-collapse text-sm bg-white dark:bg-gray-900">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">#</th>
              <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Coin</th>
              <th className="px-4 py-2 text-right text-gray-800 dark:text-gray-200">Price ({pair})</th>
              <th className="px-4 py-2 text-right text-gray-800 dark:text-gray-200">24h %</th>
              <th className="px-4 py-2 text-right text-gray-800 dark:text-gray-200">Market Cap ({pair})</th>
              <th className="px-4 py-2 text-right text-gray-800 dark:text-gray-200">Volume ({pair})</th>
              <th className="px-4 py-2 text-right text-gray-800 dark:text-gray-200">7d Chart</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <tr
                key={coin.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-200 dark:border-gray-700"
                onClick={() => router.push(`/coin/${coin.id}`)}
              >
                <td className="px-4 py-2 text-gray-900 dark:text-gray-100 font-medium">{index + 1}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{coin.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right text-gray-900 dark:text-gray-100">
                  IDR {coin.current_price.toLocaleString('id-ID')}
                </td>
                <td
                  className={clsx(
                    'px-4 py-2 text-right font-medium flex items-center justify-end gap-1',
                    coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {coin.price_change_percentage_24h > 0 ? '▲' : '▼'} {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className="px-4 py-2 text-right text-gray-900 dark:text-gray-100">
                  IDR {coin.market_cap.toLocaleString('id-ID')}
                </td>
                <td className="px-4 py-2 text-right text-gray-900 dark:text-gray-100">
                  IDR {coin.total_volume.toLocaleString('id-ID')}
                </td>
                <td className="px-4 py-2">
                  <SparklineChart 
                    data={coin.sparkline_in_7d?.price || []} 
                    color={coin.price_change_percentage_24h > 0 ? '#10b981' : '#ef4444'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
