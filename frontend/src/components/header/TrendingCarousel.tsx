'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

interface Coin {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

export default function TrendingCarousel() {
  const [trending, setTrending] = useState<Coin[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchTrending() {
      try {
        const trendingRes = await fetch('https://api.coingecko.com/api/v3/search/trending')
        const trendingJson = await trendingRes.json()
        const trendingIds = trendingJson.coins.map((c: any) => c.item.id)

        const marketRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&ids=${trendingIds.join(',')}&order=market_cap_desc&sparkline=false`
        )
        const marketData = await marketRes.json()
        setTrending(marketData)
      } catch (err) {
        console.error(err)
      }
    }

    fetchTrending()
    const interval = setInterval(fetchTrending, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const step = 1
    const delay = 16

    const scrollInterval = setInterval(() => {
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0
      } else {
        container.scrollLeft += step
      }
    }, delay)

    return () => clearInterval(scrollInterval)
  }, [trending])

  if (trending.length === 0) {
    return (
      <div className="w-full py-4 px-2 bg-[#181818]">
        <p className="text-gray-400">Loading trending coins...</p>
      </div>
    )
  }

  return (
    <div className="w-full py-6 px-2 bg-[#181818] text-white font-poppins">
      <h3 className="text-white mb-3">🔥 Trending</h3>
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-[#2a2a2a] py-2"
      >
        {trending.map((coin) => (
          <div
            key={coin.id}
            className="flex-shrink-0 w-52 cursor-pointer border border-white/30 rounded-xl p-4 hover:border-white transition"
            onClick={() => router.push(`/coin/${coin.id}`)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={coin.image}
                alt={coin.name}
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-sm">{coin.name}</span>
                <span className="text-xs text-gray-400 uppercase">{coin.symbol}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span>IDR {coin.current_price.toLocaleString('id-ID')}</span>
              <span
                className={clsx(
                  coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {coin.price_change_percentage_24h > 0 ? '▲' : '▼'}
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
