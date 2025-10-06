'use client'

import { useState, useEffect } from 'react'
import { ethers, EventLog } from 'ethers'
import { Trade, Route, SwapRouter, Pool } from '@uniswap/v3-sdk'
import { Token, Percent, CurrencyAmount } from '@uniswap/sdk-core'
import { useWallet } from '../../components/contexts/WalletContext'

export default function DexPage() {
  const { walletAddress } = useWallet()
  const [swapDex, setSwapDex] = useState('uniswap')
  const [tokenIn, setTokenIn] = useState('USDC')
  const [tokenOut, setTokenOut] = useState('WETH')
  const [swapAmount, setSwapAmount] = useState('')
  const [estimatedOutput, setEstimatedOutput] = useState('0.0')
  const [estimatedOutputIDR, setEstimatedOutputIDR] = useState('0')
  const [isSwapping, setIsSwapping] = useState(false)
  const [slippage, setSlippage] = useState('0.5')
  const [showSettings, setShowSettings] = useState(false)
  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>({})
  const [showTokenInDropdown, setShowTokenInDropdown] = useState(false)
  const [showTokenOutDropdown, setShowTokenOutDropdown] = useState(false)
  const [poolData, setPoolData] = useState<any>(null)
  const [transactionHistory, setTransactionHistory] = useState<any[]>([])
  const [loadingPool, setLoadingPool] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [tokenList, setTokenList] = useState<any[]>([])

  // Daftar DEX dengan logo, factory, dan chain
  const dexList = [
    {
      name: 'Uniswap',
      chain: 'ethereum',
      chainId: 1,
      factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      explorer: 'https://etherscan.io/',
      logo: 'https://assets.coingecko.com/markets/images/121/large/uniswap-v3.png',
      rpcUrl: process.env.NEXT_PUBLIC_INFURA_KEY
        ? `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
        : 'https://rpc.ankr.com/eth',
    },
    {
      name: 'PancakeSwap',
      chain: 'bsc',
      chainId: 56,
      factoryAddress: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
      routerAddress: '0x13f4EA83D0bd40E75C8222255bc855a98FD0D4E4',
      explorer: 'https://bscscan.com/',
      logo: 'https://assets.coingecko.com/markets/images/642/large/pancakeswap-logo.png',
      rpcUrl: 'https://bsc-dataseed.binance.org/',
    },
    {
      name: 'Aster',
      chain: 'aster',
      chainId: 0,
      factoryAddress: '0x0000000000000000000000000000000000000000',
      routerAddress: '0x0000000000000000000000000000000000000000',
      explorer: '',
      logo: 'https://via.placeholder.com/100?text=Aster',
      rpcUrl: '',
    },
  ]

  // ABI untuk Uniswap V3 Factory dan Pool
  const factoryABI = [
    'function getPool(address tokenA, address tokenB, uint24 fee) view returns (address pool)',
    'event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)',
  ]
  const poolABI = [
    'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
    'function liquidity() view returns (uint128)',
    'function token0() view returns (address)',
    'function token1() view returns (address)',
    'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
  ]
  const erc20ABI = [
    'function symbol() view returns (string)',
    'function name() view returns (string)',
    'function decimals() view returns (uint8)',
  ]

  // Daftar token hardcoded untuk fallback
  const fallbackTokens = [
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
      symbol: 'DAI',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      name: 'Dai Stablecoin',
      icon: 'https://assets.coingecko.com/coins/images/9956/thumb/dai.png',
      chain: 'ethereum',
    },
    {
      symbol: 'UNI',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      decimals: 18,
      name: 'Uniswap',
      icon: 'https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png',
      chain: 'ethereum',
    },
    {
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      name: 'Tether',
      icon: 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png',
      chain: 'ethereum',
    },
    {
      symbol: 'WBTC',
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      decimals: 8,
      name: 'Wrapped Bitcoin',
      icon: 'https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png',
      chain: 'ethereum',
    },
    {
      symbol: 'LINK',
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      decimals: 18,
      name: 'Chainlink',
      icon: 'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png',
      chain: 'ethereum',
    },
    {
      symbol: 'AAVE',
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      decimals: 18,
      name: 'Aave',
      icon: 'https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png',
      chain: 'ethereum',
    },
    {
      symbol: 'SHIB',
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      decimals: 18,
      name: 'Shiba Inu',
      icon: 'https://assets.coingecko.com/coins/images/11939/thumb/shiba.png',
      chain: 'ethereum',
    },
    {
      symbol: 'MATIC',
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      decimals: 18,
      name: 'Polygon',
      icon: 'https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png',
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

  // Fetch token list dari Subgraph dan validasi dengan Factory
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const selectedDex = dexList.find(dex => dex.name.toLowerCase() === swapDex)
        if (!selectedDex || selectedDex.chain === 'aster') {
          setTokenList(fallbackTokens.filter(token => token.chain === 'ethereum'))
          return
        }

        // Ambil 200 token populer dari Subgraph
        const subgraphUrl = selectedDex.chain === 'ethereum'
          ? 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
          : 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc'
        const response = await fetch(subgraphUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query {
                tokens(first: 200, orderBy: totalValueLockedUSD, orderDirection: desc) {
                  id
                  symbol
                  name
                  decimals
                }
              }
            `,
          }),
        })
        const { data } = await response.json()
        const tokens = data.tokens || []

        // Validasi token dengan Factory
        const provider = window.ethereum
          ? new ethers.BrowserProvider(window.ethereum)
          : new ethers.JsonRpcProvider(selectedDex.rpcUrl)
        const factory = new ethers.Contract(selectedDex.factoryAddress, factoryABI, provider)
        const validatedTokens: any[] = []
        for (const token of tokens) {
          const tokenContract = new ethers.Contract(token.id, erc20ABI, provider)
          try {
            const [symbol, name, decimals] = await Promise.all([
              tokenContract.symbol(),
              tokenContract.name(),
              tokenContract.decimals(),
            ])
            // Cek apakah token memiliki pool aktif
            const feeTiers = [500, 3000, 10000]
            let hasPool = false
            for (const fee of feeTiers) {
              const poolAddress = await factory.getPool(token.id, fallbackTokens[0].address, fee)
              if (poolAddress !== ethers.ZeroAddress) {
                hasPool = true
                break
              }
            }
            if (hasPool) {
              validatedTokens.push({
                address: token.id,
                symbol,
                name,
                decimals,
                icon: `https://assets.coingecko.com/coins/images/${symbol.toLowerCase()}/thumb/${symbol.toLowerCase()}.png` || 'https://via.placeholder.com/20?text=Token',
                chain: selectedDex.chain,
              })
            }
          } catch (error) {
            console.warn(`Failed to fetch token data for ${token.id}:`, error)
          }
        }
        console.log('Validated tokens:', validatedTokens)
        setTokenList(validatedTokens.length > 0 ? validatedTokens : fallbackTokens.filter(token => token.chain === selectedDex.chain))

        // Fetch harga dalam IDR dari CoinGecko
        const ids = validatedTokens.map(t => t.symbol.toLowerCase()).join(',')
        const priceResponse = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=idr`)
        const priceData = await priceResponse.json()
        const prices: Record<string, number> = {}
        validatedTokens.forEach(t => {
          prices[t.symbol] = priceData[t.symbol.toLowerCase()]?.idr || (['USDC', 'DAI', 'USDT'].includes(t.symbol) ? 16000 : 0)
        })
        console.log('Token prices:', prices)
        setTokenPrices(prices)
      } catch (error) {
        console.error('Failed to fetch tokens:', error)
        setErrorMessage('Failed to fetch token list. Using fallback tokens.')
        setTokenList(fallbackTokens.filter(token => token.chain === dexList.find(dex => dex.name.toLowerCase() === swapDex)?.chain || 'ethereum'))
        setTokenPrices({
          USDC: 16000,
          DAI: 16000,
          USDT: 16000,
          WETH: 35000000,
          UNI: 100000,
          WBTC: 900000000,
          LINK: 180000,
          AAVE: 1500000,
          SHIB: 0.25,
          MATIC: 6500,
          BNB: 8000000,
          CAKE: 30000,
        })
      }
    }
    fetchTokens()
    const interval = setInterval(fetchTokens, 60000)
    return () => clearInterval(interval)
  }, [swapDex])

  // Fetch data liquidity pool dari Factory
  useEffect(() => {
    const fetchPoolData = async () => {
      if (swapDex === 'aster' || !tokenIn || !tokenOut) return
      setLoadingPool(true)
      setErrorMessage('')
      try {
        const selectedDex = dexList.find(dex => dex.name.toLowerCase() === swapDex)
        if (!selectedDex?.factoryAddress) {
          setPoolData(null)
          setErrorMessage('Factory not available for this DEX.')
          return
        }
        const tokenInObj = tokenList.find(t => t.symbol === tokenIn)
        const tokenOutObj = tokenList.find(t => t.symbol === tokenOut)
        if (!tokenInObj || !tokenOutObj) {
          setPoolData(null)
          setErrorMessage('Invalid token selection.')
          return
        }

        const provider = window.ethereum
          ? new ethers.BrowserProvider(window.ethereum)
          : new ethers.JsonRpcProvider(selectedDex.rpcUrl)
        const factory = new ethers.Contract(selectedDex.factoryAddress, factoryABI, provider)

        // Cek kedua urutan token
        const feeTiers = [500, 3000, 10000]
        let poolAddress: string | null = null
        let selectedFee: number | null = null
        let isReversed = false
        for (const fee of feeTiers) {
          poolAddress = await factory.getPool(tokenInObj.address, tokenOutObj.address, fee)
          if (poolAddress !== ethers.ZeroAddress) {
            selectedFee = fee
            break
          }
          poolAddress = await factory.getPool(tokenOutObj.address, tokenInObj.address, fee)
          if (poolAddress !== ethers.ZeroAddress) {
            isReversed = true
            selectedFee = fee
            break
          }
        }

        if (poolAddress === ethers.ZeroAddress || !selectedFee) {
          setPoolData(null)
          setErrorMessage('No pool found for selected token pair.')
          return
        }

        const poolContract = new ethers.Contract(poolAddress, poolABI, provider)
        const [slot0, liquidity, token0, token1] = await Promise.all([
          poolContract.slot0(),
          poolContract.liquidity(),
          poolContract.token0(),
          poolContract.token1(),
        ])

        setPoolData({
          id: poolAddress,
          feeTier: selectedFee,
          liquidity: liquidity.toString(),
          sqrtPriceX96: slot0.sqrtPriceX96.toString(),
          tick: slot0.tick,
          isReversed,
          token0,
          token1,
        })
        console.log('Pool data:', { id: poolAddress, feeTier: selectedFee, liquidity, sqrtPriceX96: slot0.sqrtPriceX96, tick: slot0.tick, isReversed })
      } catch (error) {
        console.error('Failed to fetch pool data:', error)
        setPoolData(null)
        setErrorMessage('Failed to fetch pool data. Please try again.')
      }
      setLoadingPool(false)
    }
    fetchPoolData()
  }, [swapDex, tokenIn, tokenOut, tokenList])

  // Fetch riwayat transaksi dari event Swap
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!walletAddress || swapDex === 'aster' || !poolData) return
      setLoadingHistory(true)
      setErrorMessage('')
      try {
        const selectedDex = dexList.find(dex => dex.name.toLowerCase() === swapDex)
        if (!selectedDex?.factoryAddress) {
          setTransactionHistory([])
          setErrorMessage('Factory not available for this DEX.')
          return
        }

        const provider = window.ethereum
          ? new ethers.BrowserProvider(window.ethereum)
          : new ethers.JsonRpcProvider(selectedDex.rpcUrl)
        const poolContract = new ethers.Contract(poolData.id, poolABI, provider)

        const filter = poolContract.filters.Swap(null, walletAddress)
        const events = await poolContract.queryFilter(filter, -10000, 'latest')

        const transactions = await Promise.all(
          events.map(async (event) => {
            // ✅ pastikan tipe event adalah EventLog
            const evt = event as EventLog
            const tx = await provider.getTransaction(evt.transactionHash)
            const block = await provider.getBlock(evt.blockNumber)

            return {
              id: evt.transactionHash,
              timestamp: block?.timestamp,
              amount0: ethers.formatUnits(
                evt.args?.amount0 ?? 0,
                tokenList.find(t => t.address === poolData.token0)?.decimals || 18
              ),
              amount1: ethers.formatUnits(
                evt.args?.amount1 ?? 0,
                tokenList.find(t => t.address === poolData.token1)?.decimals || 18
              ),
              token0: { symbol: tokenList.find(t => t.address === poolData.token0)?.symbol || 'Unknown' },
              token1: { symbol: tokenList.find(t => t.address === poolData.token1)?.symbol || 'Unknown' },
            }
          })
        )

        setTransactionHistory(transactions.slice(0, 10))
      } catch (error) {
        console.error('Failed to fetch transaction history:', error)
        setTransactionHistory([])
        setErrorMessage('Failed to fetch transaction history.')
      }
      setLoadingHistory(false)
    }

    fetchTransactionHistory()
  }, [walletAddress, swapDex, poolData, tokenList])

  // Hitung estimasi output
  useEffect(() => {
    const calculateOutput = async () => {
      if (!swapAmount || Number(swapAmount) <= 0 || !poolData || !tokenIn || !tokenOut) {
        setEstimatedOutput('0.0')
        setEstimatedOutputIDR('0')
        return
      }
      try {
        console.log('Calculating output for:', { tokenIn, tokenOut, swapAmount, poolData })
        const tokenInObj = tokenList.find(t => t.symbol === tokenIn)
        const tokenOutObj = tokenList.find(t => t.symbol === tokenOut)
        if (!tokenInObj || !tokenOutObj) {
          setEstimatedOutput('0.0')
          setEstimatedOutputIDR('0')
          setErrorMessage('Invalid token selection.')
          console.warn('Invalid token selection:', { tokenIn, tokenOut, tokenList })
          return
        }

        const selectedDex = dexList.find(dex => dex.name.toLowerCase() === swapDex)
        if (!selectedDex) {
          setEstimatedOutput('0.0')
          setEstimatedOutputIDR('0')
          setErrorMessage('Invalid DEX selection.')
          return
        }

        const uniswapTokenIn = new Token(selectedDex.chainId, tokenInObj.address, tokenInObj.decimals, tokenInObj.symbol, tokenInObj.name)
        const uniswapTokenOut = new Token(selectedDex.chainId, tokenOutObj.address, tokenOutObj.decimals, tokenOutObj.symbol, tokenOutObj.name)
        const amountIn = ethers.parseUnits(swapAmount, tokenInObj.decimals)
        const amountInCurrency = CurrencyAmount.fromRawAmount(uniswapTokenIn, amountIn.toString())
        const pool = new Pool(
          poolData.isReversed ? uniswapTokenOut : uniswapTokenIn,
          poolData.isReversed ? uniswapTokenIn : uniswapTokenOut,
          Number(poolData.feeTier),
          poolData.sqrtPriceX96,
          poolData.liquidity,
          Number(poolData.tick)
        )
        const route = new Route([pool], uniswapTokenIn, uniswapTokenOut)
        const trade = await Trade.fromRoute(route, amountInCurrency, 0)
        const outputAmount = trade.outputAmount.toSignificant(6)
        setEstimatedOutput(outputAmount)

        const outputIDR = Number(outputAmount) * (tokenPrices[tokenOut] || (['USDC', 'DAI', 'USDT'].includes(tokenOut) ? 16000 : 0))
        setEstimatedOutputIDR(outputIDR.toLocaleString('id-ID'))
      } catch (error) {
        console.error('Failed to calculate output:', error)
        setEstimatedOutput('0.0')
        setEstimatedOutputIDR('0')
        if (tokenPrices[tokenIn] && tokenPrices[tokenOut]) {
          const amountIn = Number(swapAmount)
          const priceRatio = tokenPrices[tokenIn] / tokenPrices[tokenOut]
          const estimatedOut = amountIn / priceRatio
          setEstimatedOutput(estimatedOut.toFixed(6))
          setEstimatedOutputIDR((estimatedOut * tokenPrices[tokenOut]).toLocaleString('id-ID'))
          setErrorMessage('Using CoinGecko prices as fallback due to pool data error.')
        } else {
          setErrorMessage('Unable to calculate output. Please check token selection or try again.')
          console.warn('Token prices missing:', { tokenIn, tokenOut, tokenPrices })
        }
      }
    }
    calculateOutput()
  }, [swapAmount, poolData, tokenIn, tokenOut, tokenPrices, swapDex])

  // Fungsi untuk swap tokenIn dan tokenOut
  const swapTokens = () => {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
    setSwapAmount('')
    setEstimatedOutput('0.0')
    setEstimatedOutputIDR('0')
  }

  // Fungsi untuk menjalankan swap di DEX
  const executeSwap = async () => {
    if (!walletAddress) {
      alert('Please connect an Ethereum wallet from the header.')
      return
    }
    if (Number(slippage) > 50) {
      alert('Slippage tolerance must be less than 50%.')
      return
    }
    setIsSwapping(true)
    setErrorMessage('')
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const selectedDex = dexList.find(dex => dex.name.toLowerCase() === swapDex)
      if (!selectedDex?.routerAddress) {
        alert('Router not available for this DEX.')
        setIsSwapping(false)
        return
      }
      const tokenInObj = tokenList.find(t => t.symbol === tokenIn)
      const tokenOutObj = tokenList.find(t => t.symbol === tokenOut)
      if (!tokenInObj || !tokenOutObj || !poolData) {
        alert('Invalid token selection or pool data.')
        setIsSwapping(false)
        return
      }
      const uniswapTokenIn = new Token(selectedDex.chainId, tokenInObj.address, tokenInObj.decimals, tokenInObj.symbol, tokenInObj.name)
      const uniswapTokenOut = new Token(selectedDex.chainId, tokenOutObj.address, tokenOutObj.decimals, tokenOutObj.symbol, tokenOutObj.name)
      const amountIn = ethers.parseUnits(swapAmount || '0', tokenInObj.decimals)
      const amountInCurrency = CurrencyAmount.fromRawAmount(uniswapTokenIn, amountIn.toString())
      const pool = new Pool(
        poolData.isReversed ? uniswapTokenOut : uniswapTokenIn,
        poolData.isReversed ? uniswapTokenIn : uniswapTokenOut,
        Number(poolData.feeTier),
        poolData.sqrtPriceX96,
        poolData.liquidity,
        Number(poolData.tick)
      )
      const route = new Route([pool], uniswapTokenIn, uniswapTokenOut)
      const trade = await Trade.fromRoute(route, amountInCurrency, 0)
      const slippageTolerance = new Percent(Math.floor(Number(slippage) * 100).toString(), '10000')
      const swapParams = {
        recipient: walletAddress,
        slippageTolerance,
        deadline: Math.floor(Date.now() / 1000) + 60 * 20,
        ...trade,
      }
      const tx = await SwapRouter.swapCallParameters(swapParams)
      const transaction = await signer.sendTransaction({
        to: selectedDex.routerAddress,
        data: tx.data,
        value: tx.value,
      })
      await transaction.wait()
      alert('Swap successful!')
      const fetchTransactionHistory = async () => {
        setLoadingHistory(true)
        try {
          const poolContract = new ethers.Contract(poolData.id, poolABI, provider)
          const filter = poolContract.filters.Swap(null, walletAddress)
          const events = await poolContract.queryFilter(filter, -1000, 'latest')
          const transactions = await Promise.all(
            events.map(async event => {
              const tx = await provider.getTransaction(event.transactionHash)
              return {
                id: event.transactionHash,
                timestamp: (await provider.getBlock(event.blockNumber))?.timestamp,
                amount0: ethers.formatUnits(event.args.amount0, tokenList.find(t => t.address === poolData.token0)?.decimals || 18),
                amount1: ethers.formatUnits(event.args.amount1, tokenList.find(t => t.address === poolData.token1)?.decimals || 18),
                token0: { symbol: tokenList.find(t => t.address === poolData.token0)?.symbol || 'Unknown' },
                token1: { symbol: tokenList.find(t => t.address === poolData.token1)?.symbol || 'Unknown' },
              }
            })
          )
          setTransactionHistory(transactions.slice(0, 10))
        } catch (error) {
          console.error('Failed to fetch transaction history:', error)
          setErrorMessage('Failed to fetch transaction history after swap.')
        }
        setLoadingHistory(false)
      }
      fetchTransactionHistory()
    } catch (error) {
      console.error('Swap failed:', error)
      alert('Swap failed. Please try again.')
      setErrorMessage('Swap failed due to an error.')
    }
    setIsSwapping(false)
  }

  // Fungsi untuk menangani swap
  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!swapAmount || Number(swapAmount) <= 0) {
      alert('Please enter a valid amount.')
      return
    }
    if (tokenIn === tokenOut) {
      alert('Token In and Token Out cannot be the same.')
      return
    }
    await executeSwap()
  }

  // Fungsi untuk menangani pemilihan token
  const selectTokenIn = (symbol: string) => {
    setTokenIn(symbol)
    setShowTokenInDropdown(false)
    setEstimatedOutput('0.0')
    setEstimatedOutputIDR('0')
  }

  const selectTokenOut = (symbol: string) => {
    setTokenOut(symbol)
    setShowTokenOutDropdown(false)
    setEstimatedOutput('0.0')
    setEstimatedOutputIDR('0')
  }

  // Format timestamp ke tanggal yang mudah dibaca
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  }

  return (
    <div className="relative min-h-screen">
      {/* Universe Background */}
      <div className="universe-bg"></div>
      <div className="universe-bg-overlay"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Keterangan di Kolom Kiri */}
          <div className="flex flex-col justify-center animate-fade-in">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to Tana Ecosystem
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Discover seamless trading with Tana Ecosystem, a platform integrated with top DEXs like Uniswap and PancakeSwap. Swap tokens instantly with ease and security.
            </p>
            <a
              href="#swap"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:animate-gradient transition-colors"
            >
              Start Swapping Now
            </a>
          </div>

          {/* Swap Interface di Kolom Kanan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex flex-col items-center mb-4">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Swap</h2>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              {dexList.find(dex => dex.name.toLowerCase() === swapDex) && (
                <img
                  src={dexList.find(dex => dex.name.toLowerCase() === swapDex)!.logo}
                  alt={swapDex}
                  className="w-12 h-12 mt-2 object-contain animate-fade-in"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/100?text=DEX'
                  }}
                />
              )}
            </div>

            {/* Status Wallet */}
            <div className="mb-4">
              {walletAddress ? (
                <p className="text-sm text-green-500 bg-green-100 dark:bg-green-900/30 rounded-lg p-3 font-medium">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)} ({dexList.find(dex => dex.name.toLowerCase() === swapDex)?.chain || 'Unknown'})
                </p>
              ) : (
                <p className="text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg p-3 font-medium">
                  Please connect your wallet from the header to perform swaps.
                </p>
              )}
            </div>

            {/* Pesan Error */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-sm text-red-500">
                {errorMessage}
              </div>
            )}

            {/* Pengaturan Slippage */}
            {showSettings && (
              <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Settings</h3>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-900 dark:text-gray-100">Slippage Tolerance (%)</label>
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="border p-2 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="50"
                    step="0.1"
                    placeholder="0.5"
                  />
                </div>
              </div>
            )}

            {/* Interface Swap */}
            <form onSubmit={handleSwap} className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 shadow-sm">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">You Pay</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 border-none bg-transparent text-2xl text-gray-900 dark:text-gray-100 focus:outline-none"
                      min="0"
                      step="0.01"
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTokenInDropdown(!showTokenInDropdown)}
                        className="flex items-center gap-2 border p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                      >
                        <img
                          src={tokenList.find(t => t.symbol === tokenIn)?.icon || 'https://via.placeholder.com/20?text=Token'}
                          alt={tokenIn}
                          className="w-5 h-5"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/20?text=Token'
                          }}
                        />
                        <span>{tokenIn}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showTokenInDropdown && (
                        <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {tokenList.map((token) => (
                            <button
                              key={token.symbol}
                              type="button"
                              onClick={() => selectTokenIn(token.symbol)}
                              className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <img
                                src={token.icon || 'https://via.placeholder.com/20?text=Token'}
                                alt={token.symbol}
                                className="w-5 h-5"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/20?text=Token'
                                }}
                              />
                              <span>{token.symbol} (~Rp {tokenPrices[token.symbol]?.toLocaleString('id-ID') || 'N/A'})</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={swapTokens}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 shadow-sm">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">You Receive (Estimated)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${estimatedOutput} (~Rp ${estimatedOutputIDR})`}
                      disabled
                      className="flex-1 border-none bg-transparent text-2xl text-gray-900 dark:text-gray-100 opacity-50"
                    />
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowTokenOutDropdown(!showTokenOutDropdown)}
                        className="flex items-center gap-2 border p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                      >
                        <img
                          src={tokenList.find(t => t.symbol === tokenOut)?.icon || 'https://via.placeholder.com/20?text=Token'}
                          alt={tokenOut}
                          className="w-5 h-5"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/20?text=Token'
                          }}
                        />
                        <span>{tokenOut}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showTokenOutDropdown && (
                        <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {tokenList.map((token) => (
                            <button
                              key={token.symbol}
                              type="button"
                              onClick={() => selectTokenOut(token.symbol)}
                              className="flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <img
                                src={token.icon || 'https://via.placeholder.com/20?text=Token'}
                                alt={token.symbol}
                                className="w-5 h-5"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/20?text=Token'
                                }}
                              />
                              <span>{token.symbol} (~Rp {tokenPrices[token.symbol]?.toLocaleString('id-ID') || 'N/A'})</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Select DEX</label>
                <select
                  value={swapDex}
                  onChange={(e) => setSwapDex(e.target.value)}
                  className="border p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  {dexList.map((dex) => (
                    <option key={dex.name} value={dex.name.toLowerCase()}>
                      {dex.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!walletAddress || isSwapping || !swapAmount || Number(swapAmount) <= 0}
                className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                  !walletAddress || isSwapping || !swapAmount || Number(swapAmount) <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:animate-gradient'
                }`}
              >
                {isSwapping ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Swapping...
                  </div>
                ) : !walletAddress ? (
                  'Connect Wallet'
                ) : (
                  'Swap'
                )}
              </button>
            </form>

            {/* Info Liquidity Pool */}
            <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Liquidity Pool Info
              </h3>
              {loadingPool ? (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-sm">Loading pool data...</p>
                </div>
              ) : poolData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5v14" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Pool ID</p>
                      <p className="text-gray-600 dark:text-gray-400 break-all">
                        <a
                          href={`${dexList.find(dex => dex.name.toLowerCase() === swapDex)?.explorer}address/${poolData.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-500 dark:hover:text-blue-400"
                        >
                          {poolData.id.slice(0, 6)}...{poolData.id.slice(-4)}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Fee Tier</p>
                      <p className="text-gray-600 dark:text-gray-400">{Number(poolData.feeTier) / 10000}%</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Liquidity</p>
                      <p className="text-gray-600 dark:text-gray-400">{ethers.formatUnits(poolData.liquidity, 0)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Price (SqrtPriceX96)</p>
                      <p className="text-gray-600 dark:text-gray-400 break-all">{ethers.formatUnits(poolData.sqrtPriceX96, 0)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0 0h6m-6 0H6" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Tick</p>
                      <p className="text-gray-600 dark:text-gray-400">{poolData.tick}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Token Order</p>
                      <p className="text-gray-600 dark:text-gray-400">{poolData.isReversed ? `${tokenOut}/${tokenIn}` : `${tokenIn}/${tokenOut}`}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">No pool data available for selected tokens.</p>
              )}
            </div>

            {/* Riwayat Transaksi */}
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Transaction History</h3>
              {loadingHistory ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading transaction history...</p>
              ) : transactionHistory.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {transactionHistory.map((tx, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                      <p>
                        Tx ID:{' '}
                        <a
                          href={`${dexList.find(dex => dex.name.toLowerCase() === swapDex)?.explorer}${tx.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {tx.id.slice(0, 6)}...{tx.id.slice(-4)}
                        </a>
                      </p>
                      <p>Date: {formatTimestamp(tx.timestamp)}</p>
                      <p>Pair: {tx.token0.symbol}/{tx.token1.symbol}</p>
                      <p>
                        Amount: {Math.abs(Number(tx.amount0)).toFixed(4)} {tx.token0.symbol} →{' '}
                        {Math.abs(Number(tx.amount1)).toFixed(4)} {tx.token1.symbol}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">No transaction history available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}