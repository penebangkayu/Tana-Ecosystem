'use client';

import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/lib/wagmiConfig'; // Pastikan file ini sudah dibuat sebagai singleton
import { ReactNode, useState, useEffect } from 'react';

interface WagmiProviderWrapperProps {
  children: ReactNode;
}

export default function WagmiProviderWrapper({ children }: WagmiProviderWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('WagmiProvider mounted, checking providers:', {
      ethereum: !!window.ethereum,
      phantom: !!window.phantom?.ethereum,
    });
  }, []);

  if (!mounted) return null; // Hindari render sebelum klien siap

  return <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>;
}