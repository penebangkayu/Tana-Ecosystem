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
    return <p className="text-gray-500 dark:text-gray-400 p-3">No news available</p>
  }

  // Lebar card fleksibel
  const cardWidth = 256

  return (
    <div className="py-4">
      {/* Carousel */}
      <div className="overflow-x-auto scroll-pl-4 sm:scroll-pl-0">
        <div className="flex gap-4 min-w-max snap-x snap-mandatory px-2 sm:px-0">
          {news.slice(0, 10).map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-shrink-0 rounded overflow-hidden shadow hover:shadow-lg transition duration-200 snap-start`}
              style={{ width: cardWidth }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-36 object-cover"
                />
              ) : (
                <div className="w-full h-36 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                  No Image
                </div>
              )}
              <div className="p-3 bg-white dark:bg-gray-800">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Lihat Lebih Banyak
        </Link>
      </div>
    </div>
  )
}
