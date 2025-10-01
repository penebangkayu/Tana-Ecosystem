'use client'

import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li>
          <Link
            href="/admin/users"
            className="block px-4 py-2 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            Manage Users
          </Link>
        </li>
        <li>
          <Link
            href="/admin/reports"
            className="block px-4 py-2 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            Reports
          </Link>
        </li>
      </ul>
    </div>
  )
}
