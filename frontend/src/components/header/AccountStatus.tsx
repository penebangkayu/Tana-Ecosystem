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
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                    />
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300 hidden lg:inline">
                    Hi, {displayName.length > 10 ? displayName.slice(0, 10) + '...' : displayName}
                </span>
                <button
                    onClick={handleAccountLogout}
                    className="px-3 py-1 border border-gray-400 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
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
            className="px-3 py-1 border border-green-500 text-green-500 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-sm font-semibold transition-colors duration-200"
        >
            Login/Register
        </Link>
    );
}