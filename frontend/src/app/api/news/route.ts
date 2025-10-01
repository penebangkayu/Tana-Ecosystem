import Parser from 'rss-parser'

const parser = new Parser()

export async function GET() {
  try {
    const feed = await parser.parseURL('https://cointelegraph.com/rss')
    const news = feed.items.map(item => ({
      title: item.title || 'No title',
      url: item.link || '#',
      domain: item.link ? new URL(item.link).hostname : 'Unknown',
      published_at: item.pubDate || new Date().toISOString(),
      image: (item.enclosure && item.enclosure.url) || null
    }))

    return new Response(
      JSON.stringify({ results: news }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('RSS parse error:', err)
    return new Response(
      JSON.stringify({ results: [] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
