'use client'

import { useEffect, useState } from 'react'

interface NewsItem {
  title: string
  url: string
  domain: string
  published_at: string
  image?: string | null
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news', { cache: 'no-store' })
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
    return (
      <p className="text-gray-400 px-4 bg-[#181818] py-6 rounded-lg text-center border border-[#181818]">
        No news available
      </p>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 bg-[#181818] rounded-lg shadow-lg border border-[#181818]">
      <ul className="space-y-3 min-w-full">
        {news.slice(0, 5).map((item, index) => (
          <li
            key={index}
            className="border-b border-gray-700 pb-3 pt-3 hover:bg-[#222222] transition flex gap-3 rounded-lg"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#a885ff] hover:text-[#c4a7ff] hover:underline break-words text-lg"
              >
                {item.title}
              </a>
              <p className="text-sm text-gray-400 mt-1 truncate">
                {item.domain || 'Unknown'} –{' '}
                {item.published_at
                  ? new Date(item.published_at).toLocaleString()
                  : ''}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
