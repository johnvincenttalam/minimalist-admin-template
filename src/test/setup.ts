import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  // Components persist UI preferences (theme, sidebar collapsed, map places,
  // etc.) to localStorage. Clear it so tests don't bleed into each other.
  localStorage.clear()
})
