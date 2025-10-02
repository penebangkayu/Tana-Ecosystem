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
    return <p className="text-gray-500 px-4">No news available</p>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 overflow-x-auto">
      <ul className="space-y-3 min-w-full">
        {news.slice(0, 5).map((item, index) => (
          <li
            key={index}
            className="border-b border-gray-200 dark:border-gray-700 pb-3 pt-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex gap-3"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-cover rounded flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:underline break-words"
              >
                {item.title}
              </a>
              <p className="text-sm text-gray-500 mt-1 truncate">
                {item.domain || 'Unknown'} –{' '}
                {item.published_at ? new Date(item.published_at).toLocaleString() : ''}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
