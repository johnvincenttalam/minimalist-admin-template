import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAuth, useAuthStore } from './auth-store'
import { mockUsers } from '@/features/users/data/mock-users'

describe('useAuth', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isRestoring: false })
  })

  it('aliases isRestoring as loading', () => {
    useAuthStore.setState({ isRestoring: true })
    const { result } = renderHook(() => useAuth())
    expect(result.current.loading).toBe(true)
  })

  it('exposes user and isAuthenticated from the store', () => {
    useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true })
    const { result } = renderHook(() => useAuth())
    expect(result.current.user?.email).toBe(mockUsers[0].email)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('exposes login and logout actions', () => {
    const { result } = renderHook(() => useAuth())
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
  })
})
