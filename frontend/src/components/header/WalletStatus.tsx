'use client';

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/navigation'
import { useWallet } from '../contexts/WalletContext'

interface WalletStatusProps {
  handleWalletDisconnect?: () => void
}

export function WalletStatus({ handleWalletDisconnect }: WalletStatusProps) {
  const router = useRouter()
  const { walletAddress, setWalletAddress } = useWallet()
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log(
      'WalletStatus mounted, walletAddress:',
      walletAddress,
      'Provider:',
      !!window.ethereum
    )
  }, [walletAddress])

  const handleWalletConnect = async () => {
    setError('')
    setLoadingWallet(true)
    try {
      if (!(window as any).ethereum) {
        setError('MetaMask not detected.')
        setLoadingWallet(false)
        return
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const address = accounts[0]
      setWalletAddress(address)
      console.log('Wallet connected:', address)
      router.push('/dex')
    } catch (err: any) {
      console.error('Wallet connect error:', err)
      setError('Failed to connect.')
    } finally {
      setLoadingWallet(false)
    }
  }

  const handleDisconnectClick = () => {
    setWalletAddress(null)
    console.log('Wallet disconnected')
    router.push('/')
    if (handleWalletDisconnect) handleWalletDisconnect()
  }

  return (
    <div className="w-full max-w-xs">
      <div className="bg-[#181818] rounded-2xl p-3 text-center">
        <button
          onClick={walletAddress ? handleDisconnectClick : handleWalletConnect}
          disabled={loadingWallet}
          className="w-full text-sm font-semibold text-[#603abd] border border-[#603abd] rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-[#603abd] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loadingWallet
            ? 'Connecting...'
            : walletAddress
            ? `Disconnect (${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)})`
            : 'Connect Wallet'}
        </button>
        {error && (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}
      </div>
    </div>
  )
}
