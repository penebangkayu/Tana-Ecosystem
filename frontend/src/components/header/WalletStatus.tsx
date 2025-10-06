'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { useWallet } from '../contexts/WalletContext';

export function WalletStatus() {
  const router = useRouter();
  const { walletAddress, setWalletAddress } = useWallet();
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('WalletStatus mounted, walletAddress:', walletAddress, 'Provider:', !!window.ethereum);
  }, [walletAddress]);

  const handleWalletConnect = async () => {
    setError('');
    setLoadingWallet(true);
    try {
      if (!(window as any).ethereum) {
        setError('MetaMask not detected.');
        setLoadingWallet(false);
        return;
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      setWalletAddress(address);
      console.log('Wallet connected:', address);
      router.push('/dex'); // Redirect ke halaman DEX setelah connect
    } catch (err: any) {
      console.error('Wallet connect error:', err);
      setError('Failed to connect.');
    } finally {
      setLoadingWallet(false);
    }
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    console.log('Wallet disconnected');
    router.push('/'); // Redirect ke halaman utama saat disconnect
  };

  return (
    <div className="w-full max-w-xs">
      <div className="border border-gray-300 dark:border-gray-600 rounded-2xl shadow-md p-3 bg-white dark:bg-gray-800">
        <button
          onClick={walletAddress ? handleWalletDisconnect : handleWalletConnect}
          disabled={loadingWallet}
          className={`w-full text-center text-sm font-bold text-black dark:text-white disabled:text-gray-400 disabled:cursor-not-allowed transition-colors`}
        >
          {loadingWallet
            ? 'Connecting...'
            : walletAddress
            ? `Disconnect (${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)})`
            : 'Connect Wallet'}
        </button>
        {error && <p className="text-xs text-red-500 mt-1 text-center">{error}</p>}
      </div>
    </div>
  );
}