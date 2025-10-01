'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Coin {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

export default function TrendingAndGainers() {
  const [trending, setTrending] = useState<Coin[]>([])
  const [gainers, setGainers] = useState<Coin[]>([])

  useEffect(() => {
    async function fetchCoins() {
      try {
        // --- Trending Coins ---
        const trendingRes = await fetch('https://api.coingecko.com/api/v3/search/trending')
        const trendingJson = await trendingRes.json()
        const trendingIds = trendingJson.coins.map((c: any) => c.item.id).slice(0, 3)

        // Fetch full market data untuk trending coins agar dapat harga USD
        const trendingMarketRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${trendingIds.join(',')}&order=market_cap_desc&sparkline=false`
        )
        const trendingMarketData = await trendingMarketRes.json()
        setTrending(trendingMarketData)

        // --- Top Gainers 24h ---
        const gainersRes = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=100&page=1&sparkline=false'
        )
        let gainersData = await gainersRes.json()
        // filter coin dengan market_cap > 1 juta USD
        gainersData = gainersData.filter((c: any) => c.market_cap && c.market_cap > 1_000_000)
        setGainers(gainersData.slice(0, 3))
      } catch (err) {
        console.error(err)
      }
    }

    fetchCoins()
    const interval = setInterval(fetchCoins, 60000) // refresh tiap 1 menit
    return () => clearInterval(interval)
  }, [])

  const renderCoinList = (coins: Coin[]) => (
    <div className="flex flex-col gap-2">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="flex items-center justify-between p-2 bg-gray-900 rounded hover:bg-gray-800 transition"
        >
          <div className="flex items-center gap-2">
            <Image
              src={coin.image}
              alt={coin.name}
              width={28}
              height={28}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-white">{coin.name}</p>
              <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">${coin.current_price.toLocaleString()}</p>
            <p
              className={`text-xs font-medium ${
                coin.price_change_percentage_24h >= 0
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {coin.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  )

  // --- Loading placeholder ---
  if (trending.length === 0 && gainers.length === 0) {
    return (
      <div className="w-full bg-black py-4 px-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-gray-900 rounded p-4 shadow animate-pulse h-48" />
          <div className="flex-1 bg-gray-900 rounded p-4 shadow animate-pulse h-48" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-black py-4 px-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Trending Box */}
        <div className="flex-1 bg-gray-900 rounded p-4 shadow">
          <h3 className="text-yellow-400 font-semibold mb-2">🔥Trending</h3>
          {renderCoinList(trending)}
        </div>

        {/* Top Gainers Box */}
        <div className="flex-1 bg-gray-900 rounded p-4 shadow">
          <h3 className="text-green-400 font-semibold mb-2">Top Gainers (24h)</h3>
          {renderCoinList(gainers)}
        </div>
      </div>
    </div>
  )
}
