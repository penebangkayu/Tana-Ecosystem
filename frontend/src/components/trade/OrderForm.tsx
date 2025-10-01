'use client'

import { useState } from 'react'

export default function OrderForm() {
  const [symbol, setSymbol] = useState('')
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Order submitted:', { symbol, amount, side })
    alert(`Order submitted: ${side} ${amount} of ${symbol}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 p-4 border rounded">
      <div>
        <label>Symbol:</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label>Side:</label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as 'buy' | 'sell')}
          className="border px-2 py-1 w-full"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Order
      </button>
    </form>
  )
}
