import { http } from '@/shared/lib/http'
import { storage } from '@/shared/lib/storage'
import type { User } from '@/features/users/types'
import type { AuthAdapter } from './auth-adapter'

const TOKEN_KEY = 'auth-token'

interface LoginResponse {
  accessToken: string
  user: User
}

/**
 * Backend-ready auth adapter — POSTs to your real API via the shared http
 * wrapper. Stores the JWT in localStorage; http.ts pulls it from getToken()
 * and injects the Authorization header automatically.
 *
 * To activate, change the export in `./index.ts`:
 *   export const authAdapter: AuthAdapter = httpAuthAdapter
 *
 * Expected backend endpoints (override paths if yours differ):
 *   POST /auth/login   { email, password } -> { accessToken, user }
 *   POST /auth/logout                       -> 204
 *   GET  /auth/me                           -> User
 *
 * 401 handling is already done by http.ts (clears token, redirects to /login).
 */
export const httpAuthAdapter: AuthAdapter = {
  async login(email, password) {
    try {
      const res = await http.post<LoginResponse>(
        '/auth/login',
        { email, password },
        { skipAuth: true },
      )
      storage.set(TOKEN_KEY, res.accessToken)
      return res.user
    } catch {
      return null
    }
  },

  async logout() {
    try {
      await http.post('/auth/logout')
    } catch {
      // Network failures on logout shouldn't block local cleanup.
    }
    storage.remove(TOKEN_KEY)
  },

  async getCurrentUser() {
    if (!storage.get<string | null>(TOKEN_KEY, null)) return null
    try {
      return await http.get<User>('/auth/me')
    } catch {
      storage.remove(TOKEN_KEY)
      return null
    }
  },

  getToken() {
    return storage.get<string | null>(TOKEN_KEY, null)
  },
}
