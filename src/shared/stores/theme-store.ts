import { create } from 'zustand'
import { ACCENTS, type Accent } from '@/config/theme'
import { env } from '@/shared/env'
import { storage } from '@/shared/lib/storage'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  accent: Accent
  toggle: () => void
  setTheme: (theme: Theme) => void
  setAccent: (accent: Accent) => void
}

function readStoredTheme(): Theme {
  const v = storage.get<Theme | null>('theme', null)
  return v === 'dark' ? 'dark' : 'light'
}

function readStoredAccent(): Accent {
  const v = storage.get<Accent | null>('accent', null)
  return v && ACCENTS.includes(v) ? v : env.defaultAccent
}

function applyAccent(accent: Accent) {
  if (typeof document === 'undefined') return
  ACCENTS.forEach((a) => document.documentElement.classList.toggle(`accent-${a}`, a === accent))
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

const initialTheme = readStoredTheme()
const initialAccent = readStoredAccent()
applyTheme(initialTheme)
applyAccent(initialAccent)

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  accent: initialAccent,

  toggle: () =>
    set((s) => {
      const next: Theme = s.theme === 'light' ? 'dark' : 'light'
      applyTheme(next)
      storage.set('theme', next)
      return { theme: next }
    }),

  setTheme: (theme) => {
    applyTheme(theme)
    storage.set('theme', theme)
    set({ theme })
  },

  setAccent: (accent) => {
    applyAccent(accent)
    storage.set('accent', accent)
    set({ accent })
  },
}))

/**
 * Selector-based façade. Prevents the whole-store re-render footgun that
 * destructuring `useThemeStore()` causes. Prefer this in components.
 */
export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const accent = useThemeStore((s) => s.accent)
  const toggle = useThemeStore((s) => s.toggle)
  const setTheme = useThemeStore((s) => s.setTheme)
  const setAccent = useThemeStore((s) => s.setAccent)
  return { theme, accent, toggle, setTheme, setAccent }
}
