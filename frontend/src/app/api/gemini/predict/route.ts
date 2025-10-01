import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const symbol = new URL(req.url).searchParams.get('symbol') || 'btcusd'
  const API_KEY = process.env.GEMINI_API_KEY

  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing Gemini API key' }, { status: 500 })
  }

  try {
    const res = await fetch(`https://api.gemini.com/v1/pubticker/${symbol}`, {
      headers: { 'X-GEMINI-APIKEY': API_KEY }
    })
    const data = await res.json()

    return NextResponse.json({
      last: data.last,
      high: data.high,
      low: data.low,
      volume: data.volume
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
