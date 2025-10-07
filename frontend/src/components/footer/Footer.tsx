'use client'

import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-[#181818] text-white mt-12 shadow-inner">
      {/* Container utama */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Grid kolom responsif */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Deskripsi */}
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/images/tana-ecosystem-logo.png"
                alt="Tana Ecosystem"
                width={250}
                height={250}
                className="object-contain"
                priority
              />
            </Link>
            <p className="mt-2 text-white text-sm leading-relaxed">
              Tana Ecosystem is an open ecosystem for building modular, flexible, and easily integrated digital applications. This project focuses on developing solutions in the field of crypto and digital trading, including automatic trading engines, crypto asset management, integration with various blockchain platforms, and market prediction powered by artificial intelligence (AI). Suitable for research, solution development, and real-world deployment—providing a technology foundation that you can expand as needed.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-[#603abd] font-semibold mb-2">Platform</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/ai-predictions" className="hover:text-[#603abd] transition-colors">
                  AI Prediction
                </Link>
              </li>
              <li>
                <Link href="/trade-engine" className="hover:text-[#603abd] transition-colors">
                  Trade Engine
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-[#603abd] transition-colors">
                  Settings
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#603abd] transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[#603abd] font-semibold mb-2">Resources</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/news" className="hover:text-[#603abd] transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/testnet" className="hover:text-[#603abd] transition-colors">
                  Testnet
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[#603abd] font-semibold mb-2">Legal</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/terms" className="hover:text-[#603abd] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#603abd] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-gray-300 text-xs leading-relaxed border-t border-gray-800 pt-6">
          <p>
            Disclaimer: Crypto assets are high-risk and highly volatile instruments. The information
            provided on this platform is for educational and informational purposes only and does not
            constitute financial, investment, or trading advice. Please do your own research (DYOR)
            and consult with a qualified financial advisor before making any investment decisions.
          </p>
        </div>
      </div>

      {/* Copyright & Social Links */}
      <div className="border-t border-gray-800 py-4 text-gray-400 text-sm container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>
          &copy; {new Date().getFullYear()} <span className="text-[#603abd]">Tana Ecosystem</span>. All rights reserved.
        </span>
        <div className="flex items-center gap-4">
          {/* Discord */}
          <Link href="https://discord.gg/ja2FtaPV" target="_blank" className="flex items-center gap-1 hover:text-[#603abd] transition-colors">
            <Image src="/images/discord-white-icon.png" alt="Discord" width={20} height={20} />
          </Link>
          {/* Twitter */}
          <Link href="https://twitter.com/example" target="_blank" className="flex items-center gap-1 hover:text-[#603abd] transition-colors">
            <Image src="/images/x-social-media-white-icon.png" alt="Twitter" width={20} height={20} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
