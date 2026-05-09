import type { ReactNode } from 'react'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { UserRole } from '@/features/users/types'

interface RoleGuardProps {
  /** Roles permitted to see the children. The user's role must be in this list. */
  roles: UserRole[]
  children: ReactNode
  /** Rendered when the user lacks an allowed role. Defaults to nothing (silent gate). */
  fallback?: ReactNode
}

/**
 * In-page role gate — renders `children` only if the current user's role is in
 * `roles`. For route-level protection use ProtectedRoute with `allowedRoles`.
 */
export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)
  if (!user || !roles.includes(user.role)) return <>{fallback}</>
  return <>{children}</>
}
