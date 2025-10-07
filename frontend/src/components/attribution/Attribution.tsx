'use client'

import Image from "next/image"
import { Brain } from "lucide-react"

export default function Attribution() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-8 space-y-8 bg-[#181818] font-[Poppins] text-white">
      {/* Data powered by */}
      <div className="w-full max-w-7xl p-6 border border-[#603abd] rounded-xl bg-white flex flex-col items-center shadow-sm">
        <p className="text-black text-sm mb-3">
          Data powered by
        </p>
        <div className="flex gap-4 items-center justify-center">
          <a
            href="https://www.coingecko.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Image
              src="/images/CG-Stacked@2x.png"
              alt="CoinGecko"
              width={120}
              height={40}
              className="hover:animate-shake hover:opacity-80 transition"
            />
          </a>
        </div>
      </div>

      {/* News powered by */}
      <div className="w-full max-w-7xl p-6 border border-[#603abd] rounded-xl bg-white flex flex-col items-center shadow-sm">
        <p className="text-black text-sm mb-3">
          News powered by
        </p>
        <div className="flex gap-6 flex-wrap items-center justify-center">
          <a
            href="https://cointelegraph.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Image
              src="/images/cointelegraph-logo-vector.svg"
              alt="Cointelegraph"
              width={140}
              height={40}
              className="hover:animate-shake hover:opacity-80 transition"
            />
          </a>

          <a
            href="https://cryptonews.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Image
              src="/images/crypto-news-logo-full.svg"
              alt="CryptoNews"
              width={140}
              height={40}
              className="hover:animate-shake hover:opacity-80 transition"
            />
          </a>

          <a
            href="https://decrypt.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Image
              src="/images/decrypt-seeklogo.png"
              alt="Decrypt"
              width={120}
              height={40}
              className="hover:animate-shake hover:opacity-80 transition"
            />
          </a>

          <a
            href="https://tokeninsight.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Image
              src="/images/tokeninsight-seeklogo.png"
              alt="TokenInsight"
              width={140}
              height={40}
              className="hover:animate-shake hover:opacity-80 transition"
            />
          </a>

          <a
            href="https://ambcrypto.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Image
              src="/images/amb-logo-light.81b23728.svg"
              alt="AMB Crypto"
              width={140}
              height={40}
              className="hover:animate-shake hover:opacity-80 transition"
            />
          </a>
        </div>
      </div>

      {/* Analysis powered by */}
      <div className="w-full max-w-7xl p-6 border border-[#603abd] rounded-xl bg-white flex flex-col items-center shadow-sm">
        <p className="text-black text-sm mb-3">
          Analysis powered by
        </p>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#603abd] hover:animate-shake transition" />
          <span className="text-black font-semibold text-sm">
            Gemini, a Google AI model
          </span>
        </div>
      </div>
    </div>
  )
}
