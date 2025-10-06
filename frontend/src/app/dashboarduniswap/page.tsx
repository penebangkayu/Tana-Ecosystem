'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import Link from 'next/link';
import { BarChart3, Wallet, ChevronDown, Plus, Settings, AlertCircle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Pool {
  id: string;
  token0: { symbol: string; address: string; name: string; };
  token1: { symbol: string; address: string; name: string; };
  volumeUSD: string;
  totalValueLockedUSD: string;
}

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function DashboardUniswap() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [pools, setPools] = useState<Pool[]>([]);
  const [tokenIn, setTokenIn] = useState<string>('');
  const [tokenOut, setTokenOut] = useState<string>('0x6B175474E89094C44Da98b954EedeAC495271d0F'); // Default DAI
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [priceImpact, setPriceImpact] = useState(0);

  // Uniswap V3 Router
  const UNISWAP_V3_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';
  const UNISWAP_V3_ROUTER_ABI = [
    'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) external payable returns (uint256 amountOut)',
    'function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external view returns (uint256 amountOut)'
  ];

  const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // Wrapped ETH
  const feeTier = 3000; // 0.3% fee

  // The Graph Subgraph Endpoint (Uniswap V3 Mainnet)
  const SUBGRAPH_ENDPOINT = `https://gateway.thegraph.com/api/${process.env.SUBGRAPHS_KEY}/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV`;
  console.log('SUBGRAPH_ENDPOINT:', SUBGRAPH_ENDPOINT); // Debug endpoint

  // Fetch top pools from Uniswap V3 Subgraph
  const fetchPools = async () => {
    try {
      setLoadingData(true);
      if (!process.env.SUBGRAPHS_KEY) {
        throw new Error('SUBGRAPHS_KEY is not defined in .env.local. Please check the file location (should be in frontend/.env.local) and restart the server.');
      }
      const query = `
        query TopPools {
          pools(first: 10, orderBy: volumeUSD, orderDirection: desc, where: {volumeUSD_gt: "0"}) {
            id
            token0 {
              symbol
              address
              name
            }
            token1 {
              symbol
              address
              name
            }
            volumeUSD
            totalValueLockedUSD
          }
        }
      `;
      const response = await fetch(SUBGRAPH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      console.log('Subgraph Response for Pools:', result); // Debug respons
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(', '));
      }
      if (!result.data || !result.data.pools) {
        throw new Error('No pools data returned from subgraph. Check API key or subgraph ID.');
      }
      const poolList = result.data.pools.map((pool: any) => ({
        id: pool.id,
        token0: pool.token0,
        token1: pool.token1,
        volumeUSD: pool.volumeUSD || '0',
        totalValueLockedUSD: pool.totalValueLockedUSD || '0',
      }));
      setPools(poolList);
      if (poolList.length > 0) {
        setTokenOut(poolList[0].token1.address); // Default to first pool's token1
      }
    } catch (err: any) {
      console.error('Pools fetch error:', err);
      setError('Failed to load pools: ' + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch candle data from Subgraph (poolHourData for OHLC)
  const fetchCandleData = async (poolAddress: string) => {
    try {
      const query = `
        query PoolHourData {
          poolHourDatas(
            first: 168
            orderBy: periodStartUnix
            orderDirection: asc
            where: {pool: "${poolAddress.toLowerCase()}"}
          ) {
            periodStartUnix
            high
            low
            open
            close
            volumeUSD
          }
        }
      `;
      const response = await fetch(SUBGRAPH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      console.log('Subgraph Response for Candle Data:', result); // Debug respons
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (result.errors) {
        throw new Error(result.errors.map((e: any) => e.message).join(', '));
      }
      if (!result.data || !result.data.poolHourDatas) {
        throw new Error('No hour data returned for pool. Check pool address or subgraph.');
      }
      const candleList = result.data.poolHourDatas.map((d: any) => ({
        time: new Date(parseInt(d.periodStartUnix) * 1000).toLocaleDateString(),
        open: parseFloat(d.open),
        high: parseFloat(d.high),
        low: parseFloat(d.low),
        close: parseFloat(d.close),
      }));
      setCandleData(candleList);
    } catch (err: any) {
      console.error('Candle data fetch error:', err);
      setError('Failed to load chart data: ' + err.message);
    }
  };

  useEffect(() => {
    if (!(window as any).ethereum) {
      router.push('/');
      return;
    }

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    provider.listAccounts().then(accounts => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0].address);
      } else {
        router.push('/');
      }
    }).catch(() => router.push('/'));

    fetchPools();

    if (tokenOut) {
      fetchCandleData(tokenOut);
    }
  }, [router, tokenOut]);

  const estimateSwap = async () => {
    if (!tokenIn || !tokenOut || !amountIn) return;
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const router = new ethers.Contract(UNISWAP_V3_ROUTER_ADDRESS, UNISWAP_V3_ROUTER_ABI, provider);
      const amountInWei = ethers.parseEther(amountIn);
      const amountOut = await router.quoteExactInputSingle(
        tokenIn,
        tokenOut,
        feeTier,
        amountInWei,
        0
      );
      setAmountOut(formatUnits(amountOut, 18));
      // Simplified price impact (to be refined with subgraph liquidity data)
      setPriceImpact(0.5); // Placeholder
    } catch (err: any) {
      setError('Estimation failed: ' + err.message);
    }
  };

  const handleSwap = async () => {
    if (!walletAddress || !tokenIn || !tokenOut || !amountIn || !amountOut) return;
    setError('');
    setSuccess('');
    setLoadingSwap(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const router = new ethers.Contract(UNISWAP_V3_ROUTER_ADDRESS, UNISWAP_V3_ROUTER_ABI, signer);
      const amountInWei = ethers.parseEther(amountIn);
      const amountOutMin = ethers.parseUnits(amountOut, 18).mul(100 - slippage).div(100);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const tx = await router.exactInputSingle({
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: feeTier,
        recipient: walletAddress,
        deadline,
        amountIn: amountInWei,
        amountOutMinimum: amountOutMin,
        sqrtPriceLimitX96: 0,
      }, { value: amountInWei, gasLimit: 300000 });

      const receipt = await tx.wait();
      console.log('Swap successful:', receipt.hash);
      setSuccess('Swap successful! Tx: ' + receipt.hash);
      setAmountIn('');
      setAmountOut('');
    } catch (err: any) {
      console.error('Swap error:', err);
      setError('Swap failed: ' + err.message);
    } finally {
      setLoadingSwap(false);
    }
  };

  useEffect(() => {
    estimateSwap();
  }, [amountIn, tokenIn, tokenOut]);

  if (!walletAddress) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Uniswap Dashboard</h1>
          <Link href="/" className="text-sm text-blue-500 hover:underline">
            Back to Home
          </Link>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Wallet Info Card */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Wallet className="w-6 h-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Wallet</h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 break-all">Address: {walletAddress}</p>
          </div>

          {/* Top Pools Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Pools</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Pool</th>
                    <th className="px-4 py-2">Volume USD</th>
                    <th className="px-4 py-2">Liquidity</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingData ? (
                    <tr><td colSpan={3} className="text-center py-4">Loading...</td></tr>
                  ) : (
                    pools.map((pool) => (
                      <tr key={pool.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-2">
                          <span className="font-bold text-gray-900 dark:text-white">{pool.token0.symbol}/{pool.token1.symbol}</span>
                        </td>
                        <td className="px-4 py-2">${parseFloat(pool.volumeUSD).toLocaleString()}</td>
                        <td className="px-4 py-2">${parseFloat(pool.totalValueLockedUSD).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Swap on Uniswap</h2>
            <div className="space-y-4">
              {/* Token In */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
                <div className="relative">
                  <select
                    value={tokenIn}
                    onChange={(e) => setTokenIn(e.target.value)}
                    className="w-full p-3 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Token</option>
                    {pools.map((pool) => (
                      <option key={pool.id} value={pool.token0.address}>
                        {pool.token0.symbol}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={amountIn}
                  onChange={(e) => setAmountIn(e.target.value)}
                  placeholder="0.0"
                  className="w-full p-3 text-lg font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Swap Button */}
              <button
                onClick={() => {
                  const temp = tokenIn;
                  setTokenIn(tokenOut);
                  setTokenOut(temp);
                }}
                className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto -mb-5 z-10 hover:bg-blue-600 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 15L12 9L18 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Token Out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To (estimated)</label>
                <div className="relative">
                  <select
                    value={tokenOut}
                    onChange={(e) => setTokenOut(e.target.value)}
                    className="w-full p-3 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Token</option>
                    {pools.map((pool) => (
                      <option key={pool.id} value={pool.token1.address}>
                        {pool.token1.symbol}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={amountOut}
                  readOnly
                  placeholder="0.0"
                  className="w-full p-3 text-lg font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none border border-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Price Impact & Slippage */}
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Price Impact: {priceImpact.toFixed(2)}%</span>
                <div>
                  <label className="mr-2">Slippage</label>
                  <select
                    value={slippage}
                    onChange={(e) => setSlippage(Number(e.target.value))}
                    className="p-1 text-sm bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    <option value="0.1">0.1%</option>
                    <option value="0.5">0.5%</option>
                    <option value="1">1%</option>
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                disabled={loadingSwap || !tokenIn || !tokenOut || !amountIn || !amountOut}
                className={`w-full p-3 text-lg font-bold text-white rounded-lg transition-colors ${loadingSwap || !tokenIn || !tokenOut || !amountIn || !amountOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {loadingSwap ? 'Swapping...' : 'Swap'}
              </button>
              {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
              {success && <p className="text-xs text-green-500 mt-2 text-center">{success}</p>}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Price Chart</h2>
            </div>
            <div className="h-80 w-full bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
              {tokenOut ? (
                <Line options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    title: {
                      display: true,
                      text: `${pools.find(p => p.token1.address === tokenOut)?.token1.symbol || 'Unknown'} Price`,
                      color: 'gray',
                    },
                  },
                  scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Price (USD)' } },
                  },
                }} data={{
                  labels: candleData.map(d => d.time),
                  datasets: [{
                    label: 'Price',
                    data: candleData.map(d => d.close),
                    fill: false,
                    borderColor: 'rgb(59, 130, 246)',
                    tension: 0.1,
                  }],
                }} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">Select a token to view chart</div>
              )}
            </div>
          </div>
        </div>
        
        <Link href="/" className="inline-block mt-4 text-sm text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}