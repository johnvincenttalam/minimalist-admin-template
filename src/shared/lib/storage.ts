import { env } from '@/shared/env'

/**
 * StorageAdapter — swap implementation to point at IndexedDB, a remote KV
 * store, or session storage. The default is a localStorage adapter scoped to
 * the app name so multiple installs in the same origin (e.g. iframes) don't
 * collide.
 *
 * Values are JSON-serialized; pass plain data only (no functions, no class
 * instances). All methods are synchronous and best-effort: any underlying
 * exception (Safari private mode, quota exceeded) is swallowed and the
 * fallback is returned.
 */
export interface StorageAdapter {
  get<T>(key: string, fallback: T): T
  set<T>(key: string, value: T): void
  remove(key: string): void
}

function namespaceKey(prefix: string, key: string) {
  return `${prefix}:${key}`
}

function makeLocalStorageAdapter(prefix: string): StorageAdapter {
  return {
    get<T>(key: string, fallback: T): T {
      if (typeof window === 'undefined') return fallback
      try {
        const raw = window.localStorage.getItem(namespaceKey(prefix, key))
        return raw == null ? fallback : (JSON.parse(raw) as T)
      } catch {
        return fallback
      }
    },
    set<T>(key: string, value: T): void {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.setItem(namespaceKey(prefix, key), JSON.stringify(value))
      } catch {
        // Quota / disabled storage — silently no-op so callers don't crash.
      }
    },
    remove(key: string): void {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.removeItem(namespaceKey(prefix, key))
      } catch {
        // No-op.
      }
    },
  }
}

const PREFIX = env.appName.toLowerCase().replace(/\s+/g, '-')

/**
 * Default storage instance, namespaced by env.appName. Use this in stores,
 * adapters, and components instead of touching `localStorage` directly.
 */
export const storage: StorageAdapter = makeLocalStorageAdapter(PREFIX)
