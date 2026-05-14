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

export type { AuthAdapter } from './auth-adapter'
