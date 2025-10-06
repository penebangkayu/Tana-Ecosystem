'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from 'next-auth/react';
import { WalletStatus } from './WalletStatus';
import { AccountStatus } from './AccountStatus';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();
  const isAccountLoggedIn = !!session;

  useEffect(() => {
    const root = window.document.documentElement;
    if (root.classList.contains("dark")) {
      setIsDark(true);
    }
    console.log('Header mounted');
  }, []);

  const toggleDarkMode = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleAccountLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleWalletDisconnect = () => {
    console.log('Wallet disconnected from Header');
  };

  const Lnk = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className="hover:text-blue-500 text-sm md:text-base transition-colors block py-2">
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 relative">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-tana-ecosystem-hitam.png"
              alt="Tana Ecosystem"
              width={200}
              height={100}
              className="object-contain block dark:hidden"
              priority
            />
            <Image
              src="/images/logo-tana-ecosystem-putih.png"
              alt="Tana Ecosystem"
              width={200}
              height={100}
              className="object-contain hidden dark:block"
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu and Utilities */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-4 items-center">
            <Lnk href="/ai-predictions">AI Predictions</Lnk>
            <Lnk href="/trade-engine">Trade Engine</Lnk>
            <Lnk href="/dex">DEX</Lnk>
            <Lnk href="/about">About</Lnk>
          </nav>
          <div className="flex items-center space-x-4 ml-6">
            <AccountStatus handleAccountLogout={handleAccountLogout} />
            <WalletStatus handleWalletDisconnect={handleWalletDisconnect} />
            <button 
              type="button" 
              onClick={toggleDarkMode}
              className="flex items-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              <svg
                className={`w-5 h-5 ${!isDark ? "text-yellow-400" : "text-gray-400"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM14.22 4.03a1 1 0 011.42 1.42l-.7.7a1 1 0 01-1.42-1.42l.7-.7zM18 10a1 1 0 110 2h-1a1 1 0 110-2h1zm-2.03 4.22a1 1 0 01-1.42 1.42l-.7-.7a1 1 0 111.42-1.42l.7.7zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM5.78 15.97a1 1 0 01-1.42-1.42l.7-.7a1 1 0 111.42 1.42l-.7.7zM2 10a1 1 0 110-2h1a1 1 0 110 2H2zm2.03-4.22a1 1 0 011.42-1.42l.7.7a1 1 0 11-1.42 1.42l-.7-.7z" />
              </svg>
              <div className={`w-10 h-5 flex items-center rounded-full p-1 mx-1 transition-colors duration-300 ${isDark ? "bg-blue-500" : "bg-gray-300"}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isDark ? "translate-x-5" : "translate-x-0"}`}></div>
              </div>
              <svg
                className={`w-5 h-5 ${isDark ? "text-yellow-400" : "text-gray-400"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8 8 0 1010.586 10.586z" />
              </svg>
            </button>
            <Link 
              href="/settings"
              className="flex items-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
              aria-label="Settings"
            >
              <svg
                className="w-5 h-5 text-gray-900 dark:text-gray-100"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3 z-50">
          <button
            className="focus:outline-none p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-gray-900 dark:text-gray-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 px-4 py-4 space-y-2 border-t border-gray-200 dark:border-gray-700 z-40">
          <Lnk href="/ai-predictions">AI Predictions</Lnk>
          <Lnk href="/trade-engine">Trade Engine</Lnk>
          <Lnk href="/dex">DEX</Lnk>
          <Lnk href="/about">About</Lnk>
          <Lnk href="/settings">Settings</Lnk>
          {isAccountLoggedIn ? (
            <button
              onClick={handleAccountLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              Logout
            </button>
          ) : (
            <Lnk href="/auth/login">Login</Lnk>
          )}
          <div className="px-4 py-2">
            <WalletStatus handleWalletDisconnect={handleWalletDisconnect} />
          </div>
          <button 
            type="button" 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            aria-label="Toggle dark mode"
          >
            <svg
              className={`w-5 h-5 ${!isDark ? "text-yellow-400" : "text-gray-400"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM14.22 4.03a1 1 0 011.42 1.42l-.7.7a1 1 0 01-1.42-1.42l.7-.7zM18 10a1 1 0 110 2h-1a1 1 0 110-2h1zm-2.03 4.22a1 1 0 01-1.42 1.42l-.7-.7a1 1 0 111.42-1.42l.7.7zM10 18a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zM5.78 15.97a1 1 0 01-1.42-1.42l.7-.7a1 1 0 111.42 1.42l-.7.7zM2 10a1 1 0 110-2h1a1 1 0 110 2H2zm2.03-4.22a1 1 0 011.42-1.42l.7.7a1 1 0 11-1.42 1.42l-.7-.7z" />
            </svg>
            Toggle Dark Mode
          </button>
        </nav>
      )}
    </header>
  );
}