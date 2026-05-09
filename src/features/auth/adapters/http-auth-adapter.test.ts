import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/shared/env', () => ({
  env: { apiUrl: 'https://api.example.com', appName: 'Test', defaultAccent: 'zinc' },
}))

// http-auth-adapter pulls in @/shared/lib/http which pulls in @/features/auth/adapters
// (the index that decides the active adapter). Mock that to avoid the
// production-guard side effect and to control getToken/logout.
vi.mock('./index', () => ({
  authAdapter: {
    getToken: vi.fn(() => null),
    logout: vi.fn(async () => {}),
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}))

import { httpAuthAdapter } from './http-auth-adapter'
import { storage } from '@/shared/lib/storage'

const TOKEN_KEY = 'auth-token'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

const mockUser = {
  id: 'U1', name: 'Admin', email: 'admin@example.com', role: 'admin' as const,
  status: 'active' as const, createdAt: '2025-01-01',
}

describe('httpAuthAdapter', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    localStorage.clear()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('login returns the user and persists the token', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ accessToken: 'jwt-1', user: mockUser }))
    const user = await httpAuthAdapter.login('admin@example.com', 'pw')
    expect(user?.email).toBe('admin@example.com')
    expect(httpAuthAdapter.getToken()).toBe('jwt-1')
  })

  it('login posts to /auth/login with skipAuth', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ accessToken: 'jwt-1', user: mockUser }))
    await httpAuthAdapter.login('admin@example.com', 'pw')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.example.com/auth/login')
    expect(init.method).toBe('POST')
    expect(init.headers.has('authorization')).toBe(false)
  })

  it('login returns null on backend rejection', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'bad creds' }, 401))
    const user = await httpAuthAdapter.login('admin@example.com', 'wrong')
    expect(user).toBeNull()
    expect(httpAuthAdapter.getToken()).toBeNull()
  })

  it('logout posts to /auth/logout and clears token', async () => {
    storage.set(TOKEN_KEY, 'jwt-1')
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
    await httpAuthAdapter.logout()
    expect(httpAuthAdapter.getToken()).toBeNull()
  })

  it('logout still clears local token on network failure', async () => {
    storage.set(TOKEN_KEY, 'jwt-1')
    fetchMock.mockRejectedValueOnce(new Error('network down'))
    await httpAuthAdapter.logout()
    expect(httpAuthAdapter.getToken()).toBeNull()
  })

  it('getCurrentUser returns null without a token (no fetch made)', async () => {
    const user = await httpAuthAdapter.getCurrentUser()
    expect(user).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('getCurrentUser fetches /auth/me when a token is present', async () => {
    storage.set(TOKEN_KEY, 'jwt-1')
    fetchMock.mockResolvedValueOnce(jsonResponse(mockUser))
    const user = await httpAuthAdapter.getCurrentUser()
    expect(user?.email).toBe('admin@example.com')
    const [url] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.example.com/auth/me')
  })

  it('getCurrentUser clears the token on /auth/me failure', async () => {
    localStorage.setItem(TOKEN_KEY, 'jwt-stale')
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'expired' }, 401))
    const user = await httpAuthAdapter.getCurrentUser()
    expect(user).toBeNull()
    expect(httpAuthAdapter.getToken()).toBeNull()
  })

  it('getToken reads through the storage adapter', () => {
    storage.set(TOKEN_KEY, 'jwt-xyz')
    expect(httpAuthAdapter.getToken()).toBe('jwt-xyz')
  })
})
