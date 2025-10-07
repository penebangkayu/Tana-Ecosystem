'use client';

import '../../styles/globals.css';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '../components/contexts/WalletContext';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

const queryClient = new QueryClient();

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark"> {/* Tambahkan class dark */}
      <body className="bg-black text-white min-h-screen flex flex-col">
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <WalletProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </WalletProvider>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
