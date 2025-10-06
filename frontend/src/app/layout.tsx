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
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <WalletProvider>
              <Header />
              <main>{children}</main>
              <Footer />
            </WalletProvider>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}