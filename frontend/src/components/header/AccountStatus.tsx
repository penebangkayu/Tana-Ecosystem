'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface AccountStatusProps {
    handleAccountLogout: () => Promise<void>; // Fungsi logout NextAuth
}

export function AccountStatus({ handleAccountLogout }: AccountStatusProps) {
    const { data: session } = useSession();
    
    // Pengguna terautentikasi via Email/Google
    if (session?.user) {
        const displayName = session.user.name || session.user.email?.split('@')[0] || 'User';

        return (
            <div className="flex items-center space-x-2">
                {session.user.image && (
                    <Image
                        src={session.user.image}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-[#603abd]"
                    />
                )}
                <span className="text-sm text-gray-100 hidden lg:inline">
                    Hi, {displayName.length > 10 ? displayName.slice(0, 10) + '...' : displayName}
                </span>
                <button
                    onClick={handleAccountLogout}
                    className="px-3 py-1 rounded-lg border border-[#603abd] text-white hover:bg-[#603abd] hover:text-white text-sm font-semibold transition-colors duration-200"
                >
                    Logout
                </button>
            </div>
        );
    }

    // Belum login
    return (
        <Link 
            href="/auth/login"
            className="px-3 py-1 rounded-lg border border-[#603abd] text-white hover:bg-[#603abd] hover:text-white text-sm font-semibold transition-colors duration-200"
        >
            Login/Register
        </Link>
    );
}
