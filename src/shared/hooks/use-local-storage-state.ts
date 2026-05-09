import { useState, useEffect, useRef } from 'react'
import { storage } from '@/shared/lib/storage'

/**
 * Drop-in `useState` that mirrors its value to namespaced localStorage on
 * every change and restores from storage on first render. Use for UI state
 * that should survive a refresh: sidebar collapsed, last-viewed tab,
 * user-added items in a demo, etc.
 *
 * Storage failures (private mode, quota) are swallowed by the storage
 * adapter; the in-memory state continues to work as a normal useState.
 */
export function useLocalStorageState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => storage.get(key, initial))

  // Skip the very first effect — useState's lazy initializer already read the
  // stored value, so writing it back would be wasteful and could clobber
  // concurrent writes from another tab.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    storage.set(key, value)
  }, [key, value])

  return [value, setValue]
}
