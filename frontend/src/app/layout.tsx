'use client'

import { ReactNode } from 'react'
import Header from '@/components/header/Header'
import Footer from '@/components/footer/Footer'
import ThemeToggle from '@/components/theme-toggle/ThemeToggle'
import '../../styles/globals.css'

interface LayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white-100 text-gray-900">
        {/* Header tanpa border */}
        <Header />

        {/* Main content */}
        <main className="flex-1 container mx-auto p-0 space-y-8">
          {children}
        </main>

        {/* Footer tanpa border */}
        <Footer />

        {/* Theme toggle fixed */}
        <div className="fixed bottom-4 right-4">
          <ThemeToggle />
        </div>
      </body>
    </html>
  )
}
