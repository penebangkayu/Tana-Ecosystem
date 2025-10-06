// src/components/Providers.tsx
'use client'

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WagmiProviderWrapper from './WagmiProviderWrapper';

// Buat instance QueryClient di luar komponen agar tidak dibuat ulang
const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

// Komponen ini akan menjadi pembungkus tunggal di RootLayout
export default function Providers({ children }: ProvidersProps) {
  return (
    // Urutan Provider seringkali penting
    // WagmiProviderWrapper sudah bersifat 'use client'
    <WagmiProviderWrapper>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProviderWrapper>
  );
}