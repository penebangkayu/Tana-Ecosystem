'use client'
import { useState, useEffect } from 'react'

export function useAuth() {
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const login = (name: string) => {
    setUser({ name })
    localStorage.setItem('user', JSON.stringify({ name }))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return { user, login, logout }
}
