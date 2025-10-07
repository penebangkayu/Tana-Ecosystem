'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter()

  // Animasi teks ngetik
  const texts = [
    "Empowering Web3 Innovations",
    "Connecting DeFi, AI, and Blockchain",
    "Building the Future of Digital Economy",
  ]
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [blink, setBlink] = useState(true)
  const [reverse, setReverse] = useState(false)

  // Efek ketik
  useEffect(() => {
    if (index === texts.length) return
    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 1000)
      return
    }
    if (subIndex === 0 && reverse) {
      setReverse(false)
      setIndex((prev) => (prev + 1) % texts.length)
      return
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1))
    }, Math.max(reverse ? 50 : 120, parseInt(`${Math.random() * 100}`)))

    return () => clearTimeout(timeout)
  }, [subIndex, index, reverse])

  useEffect(() => {
    const timeout2 = setTimeout(() => setBlink((prev) => !prev), 500)
    return () => clearTimeout(timeout2)
  }, [blink])

  return (
    <div className="relative w-full min-h-[80vh] flex flex-col md:flex-row items-center justify-center px-6 md:px-16 bg-[#181818] overflow-hidden">

      {/* 🔹 Background animasi */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20 animate-pulse bg-[radial-gradient(circle_at_center,_#603abd_0%,_transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('/images/network-bg.svg')] bg-cover bg-center opacity-10"></div>
      </div>

      {/* 🔹 Konten teks kiri */}
      <div className="relative z-10 flex-1 text-left md:text-left max-w-xl mt-12 md:mt-0">
        
        {/* Heading utama dibagi 2 baris */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-snug mb-6">
          Do anything easily with <br/>
          <span className="text-[#603abd]">Tana Ecosystem</span>
        </h1>

        {/* Animasi ketik subheading */}
        <h2 className="text-lg sm:text-xl md:text-2xl text-gray-200 font-light leading-relaxed mb-6">
          {texts[index].substring(0, subIndex)}
          <span className={blink ? "opacity-100" : "opacity-0"}>|</span>
          {subIndex === texts[index].length && (
            <span className="text-[#603abd] font-semibold">.</span>
          )}
        </h2>

        {/* Tombol di bawah animasi ketik */}
        <button
          onClick={() => router.push("/about/")}
          className="mt-4 px-6 py-3 rounded-md text-white border-2 border-[#603abd] hover:bg-[#603abd] transition font-medium"
        >
          Get to know us
        </button>
      </div>

      {/* 🔹 Logo kanan */}
      <div className="absolute md:static bottom-24 md:bottom-auto md:ml-12 flex-shrink-0">
        <Image
          src="/images/tana-ecosystem-gif.gif"
          alt="Tana Ecosystem"
          width={240}
          height={240}
          className="rounded-full shadow-lg opacity-90 hover:opacity-100 transition"
        />
      </div>
    </div>
  )
}
