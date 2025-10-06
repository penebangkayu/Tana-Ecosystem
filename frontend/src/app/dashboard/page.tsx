'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export default function DashboardPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()

  // Simulasi status login Google (sementara dari localStorage)
  const googleUser =
    typeof window !== 'undefined' ? localStorage.getItem('googleUser') : null

  useEffect(() => {
    // Kalau belum login sama sekali
    if (!isConnected && !googleUser) {
      router.push('/login')
    }
  }, [isConnected, googleUser, router])

  // Jika belum terdeteksi login, tampilkan loading
  if (!isConnected && !googleUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>

      {googleUser ? (
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Logged in with Google</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Hello, <span className="font-semibold">{googleUser}</span>
          </p>
        </div>
      ) : isConnected ? (
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Wallet Connected</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Address: <span className="font-mono">{address}</span>
          </p>
        </div>
      ) : null}

      <button
        onClick={() => {
          localStorage.removeItem('googleUser')
          router.push('/login')
        }}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  )
}
