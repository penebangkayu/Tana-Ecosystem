'use client'

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import MarketTable from "@/components/market/MarketTable"
import TrendingCarousel from "@/components/header/TrendingCarousel"
import NewsCarousel from "@/components/header/NewsCarousel"
import Link from "next/link"
import Attribution from "@/components/attribution/Attribution"
import TypingText from "@/components/TypingText"

const PredictionChart = dynamic(() => import("@/components/charts/PredictionChart"), { ssr: false })
const CoinChart = dynamic(() => import("@/components/charts/CoinChart"), { ssr: false })

export default function DashboardPage() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const isAuthenticated = false
  const aiRef = useRef<HTMLCanvasElement>(null)
  const tradeRef = useRef<HTMLCanvasElement>(null)

  // AI Predictions animated background
  useEffect(() => {
    const canvas = aiRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.parentElement!.clientWidth)
    let height = (canvas.height = 200)

    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 3 + 1,
      color: `hsl(${280 + Math.random() * 40}, 70%, 60%)` // ungu ke biru muda
    }))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // draw lines
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (i !== j) {
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.sqrt(dx*dx + dy*dy)
            if (dist < 120) {
              ctx.strokeStyle = `rgba(96, 58, 189, ${1 - dist/120})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        })
      })

      // draw nodes
      nodes.forEach(n => {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.fill()
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      })

      requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      width = canvas.width = canvas.parentElement!.clientWidth
      height = canvas.height = 200
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Trade Engine animated background
  useEffect(() => {
    const canvas = tradeRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = canvas.parentElement!.clientWidth)
    let height = (canvas.height = 200)

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vy: Math.random() * 0.7 + 0.3,
      alpha: Math.random() * 0.5 + 0.3,
      color: Math.random() > 0.6 ? '#ffffff' : '#603abd',
      direction: Math.random() > 0.5 ? 1 : -1,
      speedX: (Math.random() - 0.5) * 0.3
    }))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        p.y += p.vy * p.direction
        p.x += p.speedX
        if (p.y > height) p.y = 0
        if (p.y < 0) p.y = height
        if (p.x > width) p.x = 0
        if (p.x < 0) p.x = width
      })
      ctx.globalAlpha = 1
      requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      width = canvas.width = canvas.parentElement!.clientWidth
      height = canvas.height = 200
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="space-y-4 bg-[#181818] text-white min-h-screen font-poppins">

      {/* Typing Animation */}
      <TypingText />

      {/* Trending Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-[#222] pb-4">
        <TrendingCarousel />
      </div>

      {/* Market Section */}
      <section className="border-b border-[#222] pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-xl font-normal mb-4 text-[#603abd]">Markets</h2>
          <MarketTable pair="IDR" />
          <div className="mt-4 text-sm text-gray-400">
            Click a coin in the table to view its chart and predictions.
          </div>
        </div>
      </section>

      {/* Coin Chart Section */}
      {selectedCoin && (
        <section className="border-b border-[#222] pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-xl font-normal mb-4 text-[#603abd]">
              {selectedCoin.toUpperCase()} Price Chart
            </h2>
            <CoinChart coinId={selectedCoin} vsCurrency="idr" />
          </div>
        </section>
      )}

      {/* AI Prediction & Trade Engine */}
      <section className="border-b border-[#222] pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">

          {/* AI Predictions */}
          <div className="relative bg-[#202020] p-4 rounded-lg shadow-md overflow-hidden">
            <canvas ref={aiRef} className="absolute inset-0 w-full h-full z-0 opacity-40"></canvas>
            <div className="relative z-10">
              <h2 className="text-xl font-normal mb-4 text-[#603abd]">AI Predictions</h2>
              <p className="text-gray-300 text-sm mb-2">
                AI Predictions utilize advanced machine learning algorithms to analyze historical and real-time market data, providing forecasts on potential price movements and market trends for selected cryptocurrencies.
              </p>
              <p className="text-gray-300 text-sm mb-4">
                AI-powered insights to help you anticipate market movements.
              </p>
              {isAuthenticated ? (
                selectedCoin ? (
                  <PredictionChart coinId={selectedCoin} />
                ) : (
                  <p className="text-gray-400">Please select a coin to see predictions.</p>
                )
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    Please log in to view detailed AI predictions.
                  </p>
                  <Link
                    href="/auth/login"
                    className="border border-[#603abd] text-[#603abd] px-4 py-2 rounded-md hover:bg-[#603abd]/10 transition-colors"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Trade Engine */}
          <div className="relative bg-[#202020] p-4 rounded-lg shadow-md overflow-hidden">
            <canvas ref={tradeRef} className="absolute inset-0 w-full h-full z-0 opacity-40"></canvas>
            <div className="relative z-10">
              <h2 className="text-xl font-normal mb-4 text-[#603abd]">Trade Engine</h2>
              <p className="text-gray-300 text-sm mb-2">
                The Trade Engine is an automated trading platform that allows users to simulate trading strategies, backtest them with historical data, and execute trades in real-time based on predefined rules and market conditions.
              </p>
              <p className="text-gray-300 text-sm mb-4">
                Access our automated trade engine to simulate strategies and execute trades.
              </p>
              {isAuthenticated ? (
                <Link
                  href="/trade-engine"
                  className="border border-[#603abd] text-[#603abd] px-4 py-2 rounded-md hover:bg-[#603abd]/10 transition-colors"
                >
                  Open Trade Engine
                </Link>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    Please log in to access the Trade Engine.
                  </p>
                  <Link
                    href="/auth/login"
                    className="border border-[#603abd] text-[#603abd] px-4 py-2 rounded-md hover:bg-[#603abd]/10 transition-colors"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* News Carousel */}
      <section className="border-b border-[#222] pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 overflow-x-hidden">
          <NewsCarousel />
        </div>
      </section>

      {/* Attribution */}
      <section className="border-b border-[#222] pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Attribution />
        </div>
      </section>
    </div>
  )
}
