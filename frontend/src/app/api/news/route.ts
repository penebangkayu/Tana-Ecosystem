import Parser from "rss-parser"

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
    ],
  },
})

// Sumber RSS crypto yang lebih stabil
const FEEDS = [
  "https://decrypt.co/feed",
  "https://cointelegraph.com/rss",
  "https://cryptonews.com/news/feed/",
  "https://ambcrypto.com/feed/",
  "https://tokeninsight.com/rss/news",
]

export async function GET() {
  try {
    const allNews = await Promise.all(
      FEEDS.map(async (url) => {
        try {
          const feed = await parser.parseURL(url)

          return feed.items.map((item) => {
            const image =
              // enclosure
              (item.enclosure && item.enclosure.url) ||
              // media:content
              (item.mediaContent && item.mediaContent.$?.url) ||
              // media:thumbnail
              (item.mediaThumbnail && item.mediaThumbnail.$?.url) ||
              // cari img di content
              (item.content &&
                item.content.match(/<img[^>]+src="([^">]+)"/)?.[1]) ||
              // cari img di content:encoded
              (item["content:encoded"] &&
                item["content:encoded"].match(/<img[^>]+src="([^">]+)"/)?.[1]) ||
              null

            return {
              title: item.title || "No title",
              url: item.link || "#",
              domain: item.link ? new URL(item.link).hostname : "Unknown",
              published_at: item.pubDate || new Date().toISOString(),
              image,
            }
          })
        } catch (err) {
          console.error(`❌ Error fetching ${url}:`, err)
          return []
        }
      })
    )

    // Gabungkan semua news jadi 1 array
    const merged = allNews.flat()

    // Sort by published_at (desc)
    merged.sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    )

    // Batasi jumlah berita (misalnya 20 terakhir)
    const limited = merged.slice(0, 20)

    return new Response(JSON.stringify({ results: limited }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("RSS parse error:", err)
    return new Response(JSON.stringify({ results: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
