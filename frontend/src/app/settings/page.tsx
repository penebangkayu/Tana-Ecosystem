'use client';

import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#181818] p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Settings</h1>
      <ul className="space-y-4 max-w-md">
        <li>
          <Link
            href="/settings/profile"
            className="block w-full px-4 py-2 text-[#603abd] border border-[#603abd] rounded-lg hover:bg-[#603abd] hover:text-white transition-colors duration-200"
          >
            Profile Settings
          </Link>
        </li>
        <li>
          <Link
            href="/settings/theme"
            className="block w-full px-4 py-2 text-[#603abd] border border-[#603abd] rounded-lg hover:bg-[#603abd] hover:text-white transition-colors duration-200"
          >
            Theme Settings
          </Link>
        </li>
        <li>
          <Link
            href="/settings/security"
            className="block w-full px-4 py-2 text-[#603abd] border border-[#603abd] rounded-lg hover:bg-[#603abd] hover:text-white transition-colors duration-200"
          >
            Security Settings
          </Link>
        </li>
      </ul>
    </div>
  )
}
