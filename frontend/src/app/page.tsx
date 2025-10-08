'use client'

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import MarketTable from "@/components/market/MarketTable"
import TrendingCarousel from "@/components/header/TrendingCarousel"
import NewsCarousel from "@/components/header/NewsCarousel"
import Link from "next/link"
import Attribution from "@/components/attribution/Attribution"
import TypingText from "@/components/TypingText"
import { motion } from "framer-motion"
import { FaCubes, FaRobot, FaChartLine, FaLayerGroup, FaBook, FaUsers } from 'react-icons/fa'

const PredictionChart = dynamic(() => import("@/components/charts/PredictionChart"), { ssr: false })
const CoinChart = dynamic(() => import("@/components/charts/CoinChart"), { ssr: false })

export default function DashboardPage() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)
  const isAuthenticated = false
  const aiRef = useRef<HTMLCanvasElement>(null)
  const tradeRef = useRef<HTMLCanvasElement>(null)

  // --- AI Predictions animated background ---
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
      color: `hsl(${280 + Math.random() * 40}, 70%, 60%)`
    }))

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
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

  // --- Trade Engine animated background ---
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

  const AboutSection = () => {
    const features = [
      { icon: <FaCubes className="w-8 h-8 text-[#603abd]" />, title: 'Modular & Extensible', desc: 'Modular and easily extensible architecture' },
      { icon: <FaRobot className="w-8 h-8 text-[#603abd]" />, title: 'Auto Trading Engine', desc: 'Automatic trading engine for crypto and digital markets' },
      { icon: <FaChartLine className="w-8 h-8 text-[#603abd]" />, title: 'AI Market Prediction', desc: 'Market prediction using artificial intelligence (AI Market Prediction)' },
      { icon: <FaLayerGroup className="w-8 h-8 text-[#603abd]" />, title: 'Blockchain Integration', desc: 'Integration-ready with multiple blockchain platforms and APIs' },
      { icon: <FaBook className="w-8 h-8 text-[#603abd]" />, title: 'Documentation', desc: 'Comprehensive documentation and practical examples' },
      { icon: <FaUsers className="w-8 h-8 text-[#603abd]" />, title: 'Community Collaboration', desc: 'Open for community collaboration and contributions' },
    ]
    return (
      <section className="py-16 bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-4xl font-bold mb-6 text-[#603abd]"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Tana Ecosystem
          </motion.h2>
          <motion.p
            className="text-gray-300 mb-12 max-w-3xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Tana Ecosystem is an open ecosystem for building modular, flexible, and easily integrated digital applications. 
            This project focuses on developing solutions in the field of crypto and digital trading, including automatic trading engines, crypto asset management, integration with blockchain platforms, and market prediction powered by artificial intelligence (AI). Suitable for research, solution development, and real-world deployment — providing a solid technological foundation that can be expanded as needed.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-[#202020] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
              >
                <div className="mb-4 flex justify-center border-2 border-[#603abd] p-4 rounded-xl hover:shadow-lg transition-all">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const aiFeatures = [
    { icon: <FaChartLine className="w-6 h-6 text-[#603abd]" />, text: "Market Forecasts" },
    { icon: <FaRobot className="w-6 h-6 text-[#603abd]" />, text: "AI Analysis" },
    { icon: <FaCubes className="w-6 h-6 text-[#603abd]" />, text: "Data Insights" },
  ]
  const tradeFeatures = [
    { icon: <FaLayerGroup className="w-6 h-6 text-[#603abd]" />, text: "Auto Trading" },
    { icon: <FaBook className="w-6 h-6 text-[#603abd]" />, text: "Strategy Backtest" },
    { icon: <FaUsers className="w-6 h-6 text-[#603abd]" />, text: "Multi Wallet" },
  ]

  const renderFeatureIcons = (features: {icon: JSX.Element, text: string}[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 text-center">
      {features.map((f, idx) => (
        <motion.div key={idx} className="flex flex-col items-center justify-center p-3 border-2 border-[#603abd] rounded-xl hover:shadow-lg transition-all"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx*0.1 }}>
          {f.icon}
          <span className="text-gray-300 text-sm mt-2">{f.text}</span>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="space-y-4 bg-[#181818] text-white min-h-screen font-poppins">
      <TypingText />
      <AboutSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 border-b border-[#222] pb-4">
        <TrendingCarousel />
      </div>

      {/* Market Section */}
      <section className="border-b border-[#222] pb-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-xl font-normal mb-4 text-[#603abd]">Markets</h2>
          <div className="relative">
            <MarketTable pair="IDR" stickyLogo />
          </div>
        </div>
      </section>

      {/* AI Predictions & Trade Engine */}
      <section className="border-b border-[#222] pb-4 space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

          {/* AI Predictions */}
          <motion.div
            className="relative bg-[#202020] p-4 rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <canvas ref={aiRef} className="absolute inset-0 w-full h-full z-0 opacity-40"></canvas>
            <div className="relative z-10">
              <h2 className="text-xl font-normal mb-2 text-[#603abd] text-center">AI Predictions</h2>
              <p className="text-gray-300 text-sm mb-2 text-center">AI-powered insights to anticipate market movements.</p>
              {renderFeatureIcons(aiFeatures)}
              <div className="mt-4 text-center">
                {isAuthenticated ? (
                  selectedCoin ? (
                    <PredictionChart coinId={selectedCoin} />
                  ) : (
                    <p className="text-gray-400">Please select a coin to see predictions.</p>
                  )
                ) : (
                  <Link
                    href="/auth/login"
                    className="border border-[#603abd] text-[#603abd] px-4 py-2 rounded-md hover:bg-[#603abd] hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* Trade Engine */}
          <motion.div
            className="relative bg-[#202020] p-4 rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <canvas ref={tradeRef} className="absolute inset-0 w-full h-full z-0 opacity-40"></canvas>
            <div className="relative z-10">
              <h2 className="text-xl font-normal mb-2 text-[#603abd] text-center">Trade Engine</h2>
              <p className="text-gray-300 text-sm mb-2 text-center">Simulate strategies and execute trades with our automated engine.</p>
              {renderFeatureIcons(tradeFeatures)}
              <div className="mt-4 text-center">
                {isAuthenticated ? (
                  <Link
                    href="/trade-engine"
                    className="border border-[#603abd] text-[#603abd] px-4 py-2 rounded-md hover:bg-[#603abd] hover:text-white transition-colors"
                  >
                    Open Trade Engine
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="border border-[#603abd] text-[#603abd] px-4 py-2 rounded-md hover:bg-[#603abd] hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

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
