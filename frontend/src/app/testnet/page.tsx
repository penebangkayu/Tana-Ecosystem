'use client'

import { useState } from 'react'

interface TradeOrder {
  coin: string
  type: 'buy' | 'sell'
  amount: number
}

export default function TestnetPage() {
  const [coin, setCoin] = useState('BTC')
  const [type, setType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState(0)
  const [orders, setOrders] = useState<TradeOrder[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newOrder: TradeOrder = { coin, type, amount }
    setOrders([newOrder, ...orders])
    setAmount(0)
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Testnet Trade Engine</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="flex gap-2">
          <select value={coin} onChange={(e) => setCoin(e.target.value)} className="border p-2 rounded">
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="BNB">BNB</option>
            <option value="ADA">ADA</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value as 'buy' | 'sell')} className="border p-2 rounded">
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Amount"
            className="border p-2 rounded flex-1"
          />
          <button type="submit" className="bg-green-500 text-white px-4 rounded">
            Submit
          </button>
        </div>
      </form>

      <h2 className="text-xl font-bold mb-2">Order History</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Coin</th>
            <th className="border px-2 py-1">Type</th>
            <th className="border px-2 py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{o.coin}</td>
              <td className="border px-2 py-1">{o.type}</td>
              <td className="border px-2 py-1">{o.amount}</td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center p-2">No orders yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
