"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface NewsItem {
  title: string
  url: string
  domain: string
  published_at: string
  image?: string | null
}

export default function NewsCarousel() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" })
        const data = await res.json()
        setNews(data.results || [])
      } catch (err) {
        console.error(err)
        setNews([])
      }
    }

    fetchNews()
    const interval = setInterval(fetchNews, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!news || news.length === 0) {
    return <p className="text-gray-400 p-3">No news available</p>
  }

  const cardWidth = 256

  return (
    <div className="py-4 bg-[#181818] text-white">
      {/* Carousel */}
      <div className="overflow-x-auto scroll-pl-4 sm:scroll-pl-0">
        <div className="flex gap-4 min-w-max snap-x snap-mandatory px-2 sm:px-0">
          {news.slice(0, 10).map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-2xl overflow-hidden border border-gray-700 hover:border-[#603abd] shadow-md hover:shadow-lg transition duration-200 snap-start bg-[#1f1f1f]"
              style={{ width: cardWidth }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-36 object-cover"
                />
              ) : (
                <div className="w-full h-36 bg-gray-800 flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}
              <div className="p-3">
                <h3 className="font-normal text-white hover:text-[#603abd] line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {item.domain || "Unknown"} –{" "}
                  {item.published_at
                    ? new Date(item.published_at).toLocaleString()
                    : ""}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Tombol Lihat Lebih Banyak */}
      <div className="flex justify-center mt-6">
        <Link
          href="/news"
          className="border border-[#603abd] text-[#603abd] px-6 py-2 rounded-full hover:bg-[#603abd] hover:text-white transition"
        >
          Lihat Lebih Banyak
        </Link>
      </div>
    </div>
  )
}
