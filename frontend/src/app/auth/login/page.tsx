'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Tambahkan deklarasi window.ethereum agar TypeScript tidak error (dibiarkan untuk konsistensi)
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

  // --- EMAIL/PASSWORD LOGIC ---
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('Attempting login with credentials:', { email }); // Debugging
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    console.log('Login result:', result); // Debugging
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  };

  // --- OAUTH LOGIC ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    console.log('Attempting login with Google'); // Debugging
    await signIn('google', { callbackUrl: '/' });
    setLoading(false);
  };

  // Tombol dinonaktifkan jika proses sedang berlangsung
  const isButtonDisabled = loading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Login</h1>

        {/* Display Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* --- 1. EMAIL/PASSWORD LOGIN --- */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full px-4 py-2 text-white rounded-lg font-semibold transition-colors duration-200 
                        ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Logging In...' : 'Login with Email'}
          </button>
        </form>

        {/* --- KETERANGAN SIGN UP BARU --- */}
        <div className="text-center mb-6 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-500 dark:text-blue-400 hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
        
        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-gray-500 dark:text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        {/* --- GOOGLE LOGIN --- */}
        <button
          onClick={handleGoogleLogin}
          disabled={isButtonDisabled}
          className={`w-full px-4 py-2 text-white rounded-lg font-semibold transition-colors duration-200 
                      ${isButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {loading ? 'Loading...' : 'Login with Google'}
        </button>
        
      </div>
    </div>
  )
}