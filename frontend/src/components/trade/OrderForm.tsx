'use client'

import { useState } from 'react'

export default function OrderForm() {
  const [amount, setAmount] = useState('')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Order submitted:', { amount, side })
    alert(`Order submitted: ${side} ${amount}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded bg-white dark:bg-gray-800 transition-colors duration-300 w-full"
    >
      {/* Amount */}
      <div className="flex flex-col w-full">
        <label className="mb-1 text-gray-800 dark:text-gray-200">Amount:</label>
        <input
          type="number"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-2 py-2 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:outline-none appearance-none"
          required
        />
      </div>

      {/* Side */}
      <div className="flex flex-col w-full">
        <label className="mb-1 text-gray-800 dark:text-gray-200">Side:</label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as 'buy' | 'sell')}
          className="border px-2 py-2 w-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
      >
        Submit Order
      </button>
    </form>
  )
}
