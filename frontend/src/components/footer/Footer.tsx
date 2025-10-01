'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo only */}
        <div>
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
          <p className="mt-2 text-gray-400 text-sm">
            Tana Ecosystem is an open ecosystem for building modular, flexible, and easily integrated digital applications. This project focuses on developing solutions in the field of crypto and digital trading, including automatic trading engines, crypto asset management, integration with various blockchain platforms, and market prediction powered by artificial intelligence (AI). Suitable for research, solution development, and real-world deployment—providing a technology foundation that you can expand as needed.
          </p>
        </div>

        {/* Platform Links */}
        <div>
          <h3 className="text-white font-semibold mb-2">Platform</h3>
          <ul className="space-y-1">
            <li><Link href="/ai-predictions" className="hover:text-white">AI Prediction</Link></li>
            <li><Link href="/trade-engine" className="hover:text-white">Trade Engine</Link></li>
            <li><Link href="/settings" className="hover:text-white">Settings</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-2">Resources</h3>
          <ul className="space-y-1">
            <li><Link href="/news" className="hover:text-white">News</Link></li>
            <li><Link href="/testnet" className="hover:text-white">Testnet</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold mb-2">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Tana Ecosystem. All rights reserved.
      </div>
    </footer>
  )
}
