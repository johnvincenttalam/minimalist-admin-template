import { Navigate } from 'react-router-dom'
import { useAuth, getDefaultRoute } from '@/features/auth/store/auth-store'
import { Spinner } from '@/shared/ui/spinner'

interface GuestRouteProps {
  children: React.ReactNode
}

/**
 * Inverse of ProtectedRoute — wrap routes that should ONLY be visible to
 * unauthenticated visitors (login, signup, password reset). If a session is
 * already active, redirects to the user's role-default route instead of
 * showing the page again.
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRoute(user.role)} replace />
  }

  return <>{children}</>
}
