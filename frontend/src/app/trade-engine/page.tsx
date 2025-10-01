// src/app/trade-engine/page.tsx
'use client'

import { useState } from 'react'
import OrderForm from '@/components/trade/OrderForm' // default import sudah sesuai

export default function TradeEnginePage() {
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC/IDR')

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Trade Engine</h1>

      {/* Pilih market */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Market:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
        >
          <option value="BTC/IDR">BTC/IDR</option>
          <option value="ETH/IDR">ETH/IDR</option>
          <option value="XRP/IDR">XRP/IDR</option>
        </select>
      </div>

      {/* Form order */}
      <OrderForm />

      {/* Info tambahan */}
      <p className="mt-4 text-gray-600">
        Gunakan Trade Engine ini untuk simulasi order pada berbagai market. Semua transaksi bersifat
        uji coba dan tidak menggunakan uang nyata.
      </p>
    </div>
  )
}
