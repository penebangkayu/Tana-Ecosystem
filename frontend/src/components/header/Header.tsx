'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from 'next-auth/react';
import { WalletStatus } from './WalletStatus';
import { AccountStatus } from './AccountStatus';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const settingsRef = useRef<HTMLDivElement>(null);

  const handleAccountLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleWalletDisconnect = () => {
    console.log('Wallet disconnected from Header');
  };

  const Lnk = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className={`hover:text-[#603abd] text-sm md:text-base transition-colors block py-2 font-normal ${
        pathname === href ? "text-[#603abd]" : "text-white"
      }`}
    >
      {children}
    </Link>
  );

  // Hilangkan dropdown ketika klik di mana saja
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#181818] shadow-md border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 relative">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/tana-ecosystem-logo.png"
              alt="Tana Ecosystem"
              width={200}
              height={100}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-4 items-center">
            <Lnk href="/ai-predictions">AI Predictions</Lnk>
            <Lnk href="/trade-engine">Trade Engine</Lnk>
            <Lnk href="/dex">DEX</Lnk>
            <Lnk href="/about">About</Lnk>
          </nav>

          <div className="flex items-center space-x-3 ml-6 relative" ref={settingsRef}>
            {/* Login / Account button */}
            <AccountStatus handleAccountLogout={handleAccountLogout} />

            {/* Connect Wallet button */}
            <WalletStatus handleWalletDisconnect={handleWalletDisconnect} />

            {/* Settings icon */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // agar klik gear tidak trigger document click
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className="flex items-center p-1 rounded-full hover:bg-[#252525] transition-colors duration-200 focus:outline-none"
              aria-label="Settings"
            >
              <svg
                className="w-5 h-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Settings Dropdown */}
            {isSettingsOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#181818] border border-[#222] rounded-md shadow-lg z-50">
                <Link
                  href="/settings/profile"
                  className="block px-4 py-2 text-[#603abd] hover:bg-[#603abd] hover:text-white rounded transition-colors duration-200"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Profile Settings
                </Link>
                <Link
                  href="/settings/theme"
                  className="block px-4 py-2 text-[#603abd] hover:bg-[#603abd] hover:text-white rounded transition-colors duration-200"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Theme Settings
                </Link>
                <Link
                  href="/settings/security"
                  className="block px-4 py-2 text-[#603abd] hover:bg-[#603abd] hover:text-white rounded transition-colors duration-200"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Security Settings
                </Link>
              </div>
            )}
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
              className="h-6 w-6 text-gray-100"
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
        <nav className="md:hidden bg-[#181818] px-4 py-4 space-y-2 border-t border-[#222] z-40">
          <Lnk href="/ai-predictions">AI Predictions</Lnk>
          <Lnk href="/trade-engine">Trade Engine</Lnk>
          <Lnk href="/dex">DEX</Lnk>
          <Lnk href="/about">About</Lnk>
          <Lnk href="/settings">Settings</Lnk>

          {/* Login / Wallet di mobile */}
          <div className="flex flex-col gap-3 pt-3">
            <AccountStatus handleAccountLogout={handleAccountLogout} />
            <WalletStatus handleWalletDisconnect={handleWalletDisconnect} />
          </div>
        </nav>
      )}
    </header>
  );
}
