'use client'

import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <ul className="space-y-4">
        <li>
          <Link
            href="/settings/profile"
            className="block px-4 py-2 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            Profile Settings
          </Link>
        </li>
        <li>
          <Link
            href="/settings/theme"
            className="block px-4 py-2 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            Theme Settings
          </Link>
        </li>
        <li>
          <Link
            href="/settings/security"
            className="block px-4 py-2 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            Security Settings
          </Link>
        </li>
      </ul>
    </div>
  )
}
