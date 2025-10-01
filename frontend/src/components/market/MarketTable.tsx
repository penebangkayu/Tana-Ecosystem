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
}

interface MarketTableProps {
  pair?: string
}

export default function MarketTable({ pair = 'IDR' }: MarketTableProps) {
  const [coins, setCoins] = useState<Coin[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter() // untuk navigasi

  const fetchTopCoins = async () => {
    try {
      setLoading(true)
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${pair.toLowerCase()}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
      )
      const data = await res.json()
      setCoins(data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const fetchSearchCoins = async (query: string) => {
    if (!query.trim()) {
      fetchTopCoins()
      return
    }
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
        )}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
      )
      const marketData = await marketRes.json()
      setCoins(marketData)
      setLoading(false)
    } catch (err) {
      console.error(err)
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
    }, 300)
  }

  if (loading) return <p className="text-gray-500 dark:text-gray-400 px-4">Loading market data...</p>
  if (coins.length === 0) return <p className="text-gray-500 dark:text-gray-400 px-4">No data found.</p>

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* Search Box */}
      <div className="px-4">
        <input
          type="text"
          placeholder="Search coin..."
          value={search}
          onChange={handleSearchChange}
          className="w-full p-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <tr
                key={coin.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-200 dark:border-gray-700"
                onClick={() => router.push(`/coin/${coin.id}`)} // navigasi ke page baru
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
                    'px-4 py-2 text-right font-medium',
                    coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className="px-4 py-2 text-right text-gray-900 dark:text-gray-100">
                  IDR {coin.market_cap.toLocaleString('id-ID')}
                </td>
                <td className="px-4 py-2 text-right text-gray-900 dark:text-gray-100">
                  IDR {coin.total_volume.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
