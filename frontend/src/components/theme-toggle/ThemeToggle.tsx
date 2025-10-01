'use client'

import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} className="px-3 py-2 border rounded">
      {theme === 'light' ? '🌞 Light' : '🌜 Dark'}
    </button>
  )
}
