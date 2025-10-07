'use client'

import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../../components/contexts/WalletContext'

interface TokenData {
  address: string
  symbol: string
  name: string
  decimals: number
  icon: string
  chain: string
}

interface PoolData {
  id: string
  feeTier: number
  liquidity: string
  sqrtPriceX96: string
  tick: number
  isReversed: boolean
  token0: string
  token1: string
}

export default function DexPage() {
  const { walletAddress } = useWallet()
  const [swapDex, setSwapDex] = useState<'uniswap' | 'pancakeswap'>('uniswap')
  const [tokenIn, setTokenIn] = useState('USDC')
  const [tokenOut, setTokenOut] = useState('WETH')
  const [swapAmount, setSwapAmount] = useState('')
  const [estimatedOutput, setEstimatedOutput] = useState('0.0')
  const [isSwapping, setIsSwapping] = useState(false)
  const [slippage, setSlippage] = useState('0.5')
  const [showSettings, setShowSettings] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [tokenList, setTokenList] = useState<TokenData[]>([])
  const [poolData, setPoolData] = useState<PoolData | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const dexList = [
    {
      name: 'Uniswap',
      chain: 'ethereum',
      chainId: 1,
      routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      rpcUrl: process.env.NEXT_PUBLIC_INFURA_KEY
        ? `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
        : 'https://rpc.ankr.com/eth',
      logo: 'https://assets.coingecko.com/markets/images/121/large/uniswap-v3.png',
    },
    {
      name: 'PancakeSwap',
      chain: 'bsc',
      chainId: 56,
      routerAddress: '0x13f4EA83D0bd40E75C8222255bc855a98FD0D4E4',
      rpcUrl: 'https://bsc-dataseed.binance.org/',
      logo: 'https://assets.coingecko.com/markets/images/642/large/pancakeswap-logo.png',
    },
  ]

  const fallbackTokens: TokenData[] = [
    {
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
      name: 'USD Coin',
      icon: 'https://assets.coingecko.com/coins/images/6319/thumb/usdc.png',
      chain: 'ethereum',
    },
    {
      symbol: 'WETH',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      name: 'Wrapped Ether',
      icon: 'https://assets.coingecko.com/coins/images/2518/thumb/weth.png',
      chain: 'ethereum',
    },
    {
      symbol: 'BNB',
      address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      decimals: 18,
      name: 'BNB',
      icon: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png',
      chain: 'bsc',
    },
    {
      symbol: 'CAKE',
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      decimals: 18,
      name: 'PancakeSwap',
      icon: 'https://assets.coingecko.com/coins/images/12632/thumb/pancakeswap-cake-logo.png',
      chain: 'bsc',
    },
  ]

  useEffect(() => {
    const selected = dexList.find(d => d.name.toLowerCase() === swapDex)
    if (selected) {
      setTokenList(fallbackTokens.filter(t => t.chain === selected.chain))
    }
  }, [swapDex])

  useEffect(() => {
    if (!swapAmount || Number(swapAmount) <= 0) {
      setEstimatedOutput('0.0')
      return
    }
    const est = (parseFloat(swapAmount) * 0.99).toFixed(4)
    setEstimatedOutput(est)
  }, [swapAmount])

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!window?.ethereum) {
      alert('Please install MetaMask.')
      return
    }
    if (!walletAddress) {
      alert('Please connect wallet first.')
      return
    }
    if (tokenIn === tokenOut) {
      alert('Input and output tokens cannot be the same.')
      return
    }

    try {
      setIsSwapping(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const dex = dexList.find(d => d.name.toLowerCase() === swapDex)
      if (!dex) throw new Error('Invalid DEX')

      const tx = {
        to: dex.routerAddress,
        value: ethers.parseEther('0'),
      }
      await signer.sendTransaction(tx)
      alert('Swap transaction simulated successfully!')
    } catch (err) {
      console.error(err)
      setErrorMessage('Swap failed.')
    } finally {
      setIsSwapping(false)
    }
  }

  // Animated background with white and purple stars
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // stars: random white or purple
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3,
      speed: Math.random() * 0.4 + 0.2,
      color: Math.random() < 0.8 ? '#603abd' : '#ffffff', // 20% purple, 80% white
    }))

    const animate = () => {
      ctx.fillStyle = '#181818'
      ctx.fillRect(0, 0, width, height)
      stars.forEach((star) => {
        star.y -= star.speed
        if (star.y < 0) star.y = height
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.fill()
      })
      requestAnimationFrame(animate)
    }

    animate()
    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#181818] text-gray-100 font-[Poppins]">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />

      <div className="relative z-10 max-w-3xl mx-auto p-8 sm:p-12 backdrop-blur-md bg-[#1f1f1f]/80 border border-[#2b2b2b] rounded-2xl shadow-lg mt-16">
        <h1 className="text-4xl font-bold mb-4 text-center">
          <span className="text-[#603abd]">Tana</span> DEX
        </h1>

        {/* Keterangan swap aman */}
        <p className="text-center text-gray-300 mb-8">
          Swap tokens instantly and securely <span className="text-[#603abd] font-medium">directly from here</span>.
        </p>

        {errorMessage && (
          <p className="bg-red-900 text-red-200 p-2 rounded mb-4 border border-red-700 text-center">
            {errorMessage}
          </p>
        )}

        <form
          onSubmit={handleSwap}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-300 mb-1">From</label>
            <select
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#2b2b2b] text-gray-100 focus:border-[#603abd] focus:ring-[#603abd] outline-none transition-all"
              value={tokenIn}
              onChange={(e) => setTokenIn(e.target.value)}
            >
              {tokenList.map((t) => (
                <option key={t.symbol}>{t.symbol}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">To</label>
            <select
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#2b2b2b] text-gray-100 focus:border-[#603abd] focus:ring-[#603abd] outline-none transition-all"
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value)}
            >
              {tokenList.map((t) => (
                <option key={t.symbol}>{t.symbol}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Amount</label>
            <input
              type="number"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#2b2b2b] text-gray-100 focus:border-[#603abd] focus:ring-[#603abd] outline-none transition-all"
              placeholder="0.0"
            />
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Estimated Output: <span className="text-[#603abd]">{estimatedOutput}</span> {tokenOut}
          </p>

          <button
            type="submit"
            disabled={isSwapping}
            className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-[#603abd] to-[#7e5bef] hover:opacity-90 transition-all disabled:opacity-60"
          >
            {isSwapping ? 'Swapping...' : 'Swap'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setSwapDex(swapDex === 'uniswap' ? 'pancakeswap' : 'uniswap')}
            className="text-sm text-[#603abd] hover:underline transition-all"
          >
            Switch to {swapDex === 'uniswap' ? 'PancakeSwap' : 'Uniswap'}
          </button>
        </div>
      </div>
    </div>
  )
}
