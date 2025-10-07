'use client'

import { useEffect, useState } from "react"

interface NewsItem {
  title: string
  url: string
  domain: string
  published_at: string
  image?: string | null
}

export default function NewsPage() {
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
  }, [])

  return (
    <div className="min-h-screen w-full bg-[#181818] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-6">
          Berita Terbaru
        </h1>

        {(!news || news.length === 0) ? (
          <p className="text-gray-400">No news available</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded overflow-hidden shadow hover:shadow-lg transition duration-200 bg-[#181818] border border-gray-700"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-100 hover:text-blue-500 line-clamp-2">
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
        )}
      </div>
    </div>
  )
}
