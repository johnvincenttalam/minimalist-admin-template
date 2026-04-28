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
  setUser: (user: User) => void
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

  setUser: (user) => {
    set({ user, isAuthenticated: true })
  },
}))

/**
 * Call once at app startup (e.g. in providers.tsx) to restore the session.
 * Separated from module scope so the call site is explicit and testable.
 */
export function initAuth() {
  useAuthStore.getState().restore()
}
