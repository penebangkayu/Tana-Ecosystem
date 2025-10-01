'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-tana-ecosystem.png"
            alt="Tana Ecosystem"
            width={250}
            height={250}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/ai-predictions" className="hover:text-blue-500">AI Predictions</Link>
          <Link href="/trade-engine" className="hover:text-blue-500">Trade Engine</Link>
          <Link href="/settings" className="hover:text-blue-500">Settings</Link>
          <Link href="/testnet" className="hover:text-blue-500">Testnet</Link>
          <Link href="/about" className="hover:text-blue-500">About</Link>
          <Link href="/auth/login" className="hover:text-blue-500">Login</Link>
          <Link href="/auth/signup" className="hover:text-blue-500 font-semibold">Sign Up</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <Link href="/ai-predictions" className="block hover:text-blue-500">AI Predictions</Link>
          <Link href="/trade-engine" className="block hover:text-blue-500">Trade Engine</Link>
          <Link href="/settings" className="block hover:text-blue-500">Settings</Link>
          <Link href="/testnet" className="block hover:text-blue-500">Testnet</Link>
          <Link href="/about" className="block hover:text-blue-500">About</Link>
          <Link href="/auth/login" className="block hover:text-blue-500">Login</Link>
          <Link href="/auth/signup" className="block hover:text-blue-500 font-semibold">Sign Up</Link>
        </nav>
      )}
    </header>
  )
}
