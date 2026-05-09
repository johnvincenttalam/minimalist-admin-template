import { mockAuthAdapter } from './mock-auth-adapter'
// import { httpAuthAdapter } from './http-auth-adapter'
import type { AuthAdapter } from './auth-adapter'

/**
 * The active auth adapter. Change this single export to swap implementations.
 * Everything else in the app reads auth through this binding.
 *
 * Backend-ready alternative: import { httpAuthAdapter } above and assign:
 *   export const authAdapter: AuthAdapter = httpAuthAdapter
 */
export const authAdapter: AuthAdapter = mockAuthAdapter

// Production safety net: mockAuthAdapter accepts any password and is intended
// for local dev only. If a build ships with mock auth still wired, fail loud
// at app boot rather than silently authenticating anyone who knows an email.
if (import.meta.env.PROD && authAdapter === mockAuthAdapter) {
  throw new Error(
    'mockAuthAdapter is active in a production build. Swap to a real ' +
    'AuthAdapter (e.g. httpAuthAdapter) in features/auth/adapters/index.ts ' +
    'before deploying.',
  )
}

export type { AuthAdapter } from './auth-adapter'
