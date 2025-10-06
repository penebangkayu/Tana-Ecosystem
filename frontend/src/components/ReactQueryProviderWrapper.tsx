'use client'

import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface Props {
  children: ReactNode
}

// Buat QueryClient di top-level supaya tidak recreated tiap render
const queryClient = new QueryClient()

export default function ReactQueryProviderWrapper({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
