import { create } from 'zustand'
import type { User, UserRole } from '@/features/users/types'
import { authAdapter } from '@/features/auth/adapters'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isRestoring: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  restore: () => Promise<void>
}

const roleRouteMap: Record<UserRole, string> = {
  admin: '/admin',
}

export function getDefaultRoute(role: UserRole): string {
  return roleRouteMap[role]
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isRestoring: true,

  login: async (email, password) => {
    const user = await authAdapter.login(email, password)
    if (user) {
      set({ user, isAuthenticated: true })
      return true
    }
    return false
  },

  logout: async () => {
    await authAdapter.logout()
    set({ user: null, isAuthenticated: false })
  },

  restore: async () => {
    const user = await authAdapter.getCurrentUser()
    set({ user, isAuthenticated: !!user, isRestoring: false })
  },
}))

/**
 * Call once at app startup (e.g. in providers.tsx) to restore the session.
 * Separated from module scope so the call site is explicit and testable.
 */
export function initAuth() {
  useAuthStore.getState().restore()
}

/**
 * Ergonomic hook over useAuthStore — also fixes the whole-store re-render
 * footgun by using selectors for each slice. Prefer this in components;
 * reach for useAuthStore directly only when you need raw store access
 * (e.g. tests calling setState).
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isRestoring = useAuthStore((s) => s.isRestoring)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)
  return { user, isAuthenticated, loading: isRestoring, login, logout }
}
