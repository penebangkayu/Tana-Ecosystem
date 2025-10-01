'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [status, setStatus] = useState('')

  const handleSave = async () => {
    try {
      await updateProfile({ name, email })
      setStatus('Profile updated successfully')
    } catch (err: any) {
      setStatus(err.message || 'Failed to update profile')
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save
        </button>
        {status && <p className="mt-2 text-sm text-green-600">{status}</p>}
      </div>
    </div>
  )
}
