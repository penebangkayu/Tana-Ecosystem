// src/app/trade-engine/page.tsx
'use client'

import { useState } from 'react'
import OrderForm from '@/components/trade/OrderForm' // default import sudah sesuai

export default function TradeEnginePage() {
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC/IDR')

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center sm:text-left">
          Trade Engine
        </h1>

        {/* Pilih market */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="font-semibold text-gray-800 dark:text-gray-200 min-w-[120px]">
            Select Market:
          </label>
          <select
            className="border rounded px-3 py-2 w-full sm:w-auto text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 transition-colors duration-300"
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
          >
            <option value="BTC/IDR">BTC/IDR</option>
            <option value="ETH/IDR">ETH/IDR</option>
            <option value="XRP/IDR">XRP/IDR</option>
          </select>
        </div>

        {/* Form order */}
        <div className="mb-4 w-full">
          {/* Wrapper untuk override input style di OrderForm */}
          <div className="w-full space-y-4">
            <OrderForm />
          </div>
        </div>

        {/* Info tambahan */}
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-center sm:text-left">
          Gunakan Trade Engine ini untuk simulasi order pada berbagai market. Semua transaksi bersifat
          uji coba dan tidak menggunakan uang nyata.
        </p>
      </div>

      {/* Styling global untuk dark mode input */}
      <style jsx global>{`
        input, textarea {
          color: #1f2937; /* default gray-900 */
          background-color: #ffffff; /* default white */
          transition: background-color 0.3s, color 0.3s;
        }
        html.dark input,
        html.dark textarea {
          color: #f3f4f6; /* gray-100 */
          background-color: #1f2937; /* gray-800 */
        }
      `}</style>
    </div>
  )
}
