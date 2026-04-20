import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { UserRole } from '@/features/users/types'
import { Spinner } from '@/shared/ui/spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isRestoring } = useAuthStore()

  // Waiting for authAdapter.getCurrentUser() to resolve on first load / refresh.
  if (isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
