'use client'
import { createContext, useContext } from 'react'
import { useTheme } from '@/hooks/useTheme'

const ThemeContext = createContext<any>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme()
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export const useThemeContext = () => useContext(ThemeContext)
