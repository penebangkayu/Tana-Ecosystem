import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { formatPlainText } from '../../../../utils/formatter'

export async function POST(req: Request) {
  const API_KEY = process.env.GEMINI_API_KEY
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'Missing GEMINI_API_KEY in env.local' },
      { status: 500 }
    )
  }

  try {
    const { coin, candles, timeframe, limit } = await req.json()

    if (!coin || !candles) {
      return NextResponse.json(
        { error: 'Missing coin or candles data' },
        { status: 400 }
      )
    }

    // Init Gemini
    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Prompt analisis (Bahasa Indonesia, harga dalam IDR)
    const prompt = `
      Kamu adalah analis crypto profesional. 
      Berikut adalah ${limit} data candle terakhir untuk koin ${coin} dalam timeframe ${timeframe}.
      Format data: time, open, high, low, close. Semua harga tercatat dalam IDR (Rupiah).
      Data:
      ${candles
        .map(
          (c: any) =>
            `${c.time}: O=${c.open} IDR, H=${c.high} IDR, L=${c.low} IDR, C=${c.close} IDR`
        )
        .join('\n')}

      Tolong berikan analisis tren harga saat ini, potensi pergerakan berikutnya,
      serta risiko yang harus diperhatikan trader/investor. 
      Jawaban dalam bahasa Indonesia dengan menyebutkan angka dalam Rupiah (IDR).
    `

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Format hasil agar lebih readable
    const formatted = formatPlainText(text)

    // ✅ kembalikan hasil formatted, bukan raw
    return NextResponse.json({ analysis: formatted })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
