'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const SwapComponent = ({ walletAddress }: { walletAddress: string | null }) => {
  const [amountIn, setAmountIn] = useState('');
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [error, setError] = useState('');
  const [chainId, setChainId] = useState<number | null>(null);

  // Uniswap Router V2
  const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  const UNISWAP_ROUTER_ABI = [
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)'
  ];

  const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI sebagai contoh

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        checkNetwork();
      });
      checkNetwork();
    }
  }, []);

  const checkNetwork = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setChainId(network.chainId);
    }
  };

  const handleSwap = async () => {
    if (!walletAddress || !amountIn) return;
    setError('');
    setLoadingSwap(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, signer);

      const amountInWei = ethers.parseEther(amountIn);
      const path = [WETH_ADDRESS, DAI_ADDRESS];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 menit
      const amounts = await router.getAmountsOut(amountInWei, path);
      const amountOutMin = amounts[1].mul(99).div(100); // 1% slippage tolerance

      const tx = await router.swapExactETHForTokens(
        amountOutMin,
        path,
        walletAddress,
        deadline,
        { value: amountInWei, gasLimit: 300000 }
      );
      const receipt = await tx.wait();
      console.log('Swap successful:', receipt.hash);
      setError('Swap successful! Tx: ' + receipt.hash);
      setAmountIn(''); // Reset input
    } catch (err: any) {
      console.error('Swap error:', err);
      setError('Swap failed: ' + err.message);
    } finally {
      setLoadingSwap(false);
    }
  };

  if (!walletAddress) return null;

  return (
    <div className="w-full max-w-xs mt-4">
      <div className="border border-gray-300 dark:border-gray-600 rounded-2xl shadow-md p-3 bg-white dark:bg-gray-800">
        <div className="mb-2">
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="Amount ETH to swap"
            className="w-full p-2 text-sm font-bold text-black dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none"
          />
        </div>
        <button
          onClick={handleSwap}
          disabled={loadingSwap || !amountIn}
          className={`w-full text-center text-sm font-bold text-black dark:text-white disabled:text-gray-400 disabled:cursor-not-allowed transition-colors bg-green-100 dark:bg-green-900 p-2 rounded-lg`}
        >
          {loadingSwap ? 'Swapping...' : 'Swap ETH to DAI'}
        </button>
        {error && <p className="text-xs text-red-500 mt-1 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default SwapComponent;