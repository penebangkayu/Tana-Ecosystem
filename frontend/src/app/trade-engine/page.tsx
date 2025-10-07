'use client'

import { useState } from 'react'
import OrderForm from '@/components/trade/OrderForm'

export default function TradeEnginePage() {
  const [selectedMarket, setSelectedMarket] = useState<string>('BTC/IDR')

  return (
    <div className="min-h-screen bg-[#181818] text-gray-100 font-[Poppins] flex flex-col items-center justify-start py-16 px-6">
      <div className="w-full max-w-5xl bg-[#1f1f1f]/80 backdrop-blur-sm border border-[#2b2b2b] rounded-2xl shadow-lg p-8 transition-all duration-500">
        
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-8 text-center sm:text-left">
          <span className="text-[#603abd]">Trade</span> Engine
        </h1>

        {/* Select Market */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="font-semibold text-gray-200 min-w-[120px]">
            Select Market:
          </label>
          <select
            className="border border-[#2b2b2b] bg-[#2a2a2a] text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#603abd] transition-all w-full sm:w-auto"
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
          >
            <option value="BTC/IDR">BTC/IDR</option>
            <option value="ETH/IDR">ETH/IDR</option>
            <option value="XRP/IDR">XRP/IDR</option>
          </select>
        </div>

        {/* Order Form Section */}
        <div className="bg-[#242424]/80 border border-[#2b2b2b] rounded-xl p-6 shadow-inner">
          <OrderForm />
        </div>

        {/* Info Text */}
        <p className="mt-6 text-gray-400 leading-relaxed text-center sm:text-left">
          Use the <span className="text-[#603abd] font-medium">Trade Engine</span> to simulate orders across multiple markets. 
          All transactions are <span className="text-gray-200">test-only</span> and do not involve real funds.
        </p>
      </div>

      {/* Global input styles for dark mode consistency */}
      <style jsx global>{`
        input, textarea, select {
          color: #f3f4f6;
          background-color: #2a2a2a;
          border-color: #2b2b2b;
          transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #603abd;
          box-shadow: 0 0 6px #603abd50;
        }
      `}</style>
    </div>
  )
}
