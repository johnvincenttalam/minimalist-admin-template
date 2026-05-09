import { useEffect } from 'react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { initAuth, useAuthStore } from '@/features/auth'
import { setUnauthorizedHandler } from '@/shared/lib/http'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

/**
 * Bridges the http client's 401 handler to react-router's navigate so
 * unauthorized responses do a soft client-side redirect instead of a hard
 * window.location reload (which would drop in-flight queries and React
 * Router state). Must live inside <BrowserRouter>.
 */
function HttpAuthBridge() {
  const navigate = useNavigate()

  useEffect(() => {
    setUnauthorizedHandler(() => {
      useAuthStore.getState().logout()
      navigate('/login', { replace: true })
    })
    return () => setUnauthorizedHandler(null)
  }, [navigate])

  return null
}

/**
 * Restores the auth session once on mount. Deferred to a useEffect so
 * importing this module (in tests, in HMR) doesn't trigger side effects.
 */
function AuthBootstrap() {
  useEffect(() => {
    initAuth()
  }, [])
  return null
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBootstrap />
        <HttpAuthBridge />
        {children}
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{ className: 'text-sm' }} richColors closeButton />
    </QueryClientProvider>
  )
}
