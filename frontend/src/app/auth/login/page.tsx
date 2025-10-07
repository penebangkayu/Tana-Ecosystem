'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Tambahkan deklarasi window.ethereum agar TypeScript tidak error
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // --- EMAIL/PASSWORD LOGIN ---
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/')
    }
  }

  // --- GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    await signIn('google', { callbackUrl: '/' })
    setLoading(false)
  }

  const isButtonDisabled = loading

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818]">
      <div className="bg-[#202020] p-8 rounded-2xl shadow-lg w-full max-w-md border border-[#603abd]/50">
        <h1 className="text-3xl font-semibold mb-6 text-white text-center">
          Login to <span className="text-[#603abd]">Tana Ecosystem</span>
        </h1>

        {/* Display Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-300 border border-red-500 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* --- 1. EMAIL/PASSWORD LOGIN --- */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-300"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-[#444] rounded-lg bg-[#181818] text-gray-100 focus:border-[#603abd] focus:ring-1 focus:ring-[#603abd] outline-none transition"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-[#444] rounded-lg bg-[#181818] text-gray-100 focus:border-[#603abd] focus:ring-1 focus:ring-[#603abd] outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors duration-200 
              ${isButtonDisabled
                ? 'bg-[#603abd]/40 text-gray-300 cursor-not-allowed'
                : 'bg-[#603abd] hover:bg-[#7048db] text-white'}`}
          >
            {loading ? 'Logging In...' : 'Login with Email'}
          </button>
        </form>

        {/* --- SIGN UP LINK --- */}
        <div className="text-center mb-6 text-sm">
          <p className="text-gray-400">
            Don’t have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-[#603abd] hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-[#333]" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-[#333]" />
        </div>

        {/* --- GOOGLE LOGIN --- */}
        <button
          onClick={handleGoogleLogin}
          disabled={isButtonDisabled}
          className={`w-full px-4 py-3 rounded-lg font-semibold border border-[#603abd] text-[#603abd] hover:bg-[#603abd]/10 transition-colors 
            ${isButtonDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Loading...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  )
}
