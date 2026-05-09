import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/shared/env', () => ({
  env: { apiUrl: 'https://api.example.com', appName: 'Test', defaultAccent: 'zinc' },
}))

vi.mock('@/features/auth/adapters', () => ({
  authAdapter: {
    getToken: vi.fn(() => null),
    logout: vi.fn(async () => {}),
    login: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}))

import { http, HttpError, setUnauthorizedHandler } from './http'
import { authAdapter } from '@/features/auth/adapters'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

describe('http client', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.mocked(authAdapter.getToken).mockReturnValue(null)
    vi.mocked(authAdapter.logout).mockResolvedValue(undefined)
    setUnauthorizedHandler(null)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('GET prepends apiUrl and parses JSON', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true, count: 3 }))
    const result = await http.get<{ ok: boolean; count: number }>('/users')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.example.com/users')
    expect(init.method).toBe('GET')
    expect(result).toEqual({ ok: true, count: 3 })
  })

  it('appends query params, skipping null/undefined', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}))
    await http.get('/items', { params: { q: 'a b', page: 2, missing: null, also: undefined } })
    const [url] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.example.com/items?q=a+b&page=2')
  })

  it('serializes JSON body and sets Content-Type', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: '1' }))
    await http.post('/users', { name: 'Alice' })
    const [, init] = fetchMock.mock.calls[0]
    expect(init.body).toBe('{"name":"Alice"}')
    expect(init.headers.get('content-type')).toBe('application/json')
  })

  it('attaches Authorization Bearer when a token is available', async () => {
    vi.mocked(authAdapter.getToken).mockReturnValue('jwt-abc')
    fetchMock.mockResolvedValueOnce(jsonResponse({}))
    await http.get('/me')
    const [, init] = fetchMock.mock.calls[0]
    expect(init.headers.get('authorization')).toBe('Bearer jwt-abc')
  })

  it('skips Authorization when skipAuth is true', async () => {
    vi.mocked(authAdapter.getToken).mockReturnValue('jwt-abc')
    fetchMock.mockResolvedValueOnce(jsonResponse({}))
    await http.post('/auth/login', {}, { skipAuth: true })
    const [, init] = fetchMock.mock.calls[0]
    expect(init.headers.has('authorization')).toBe(false)
  })

  it('throws HttpError on non-2xx with parsed message', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'forbidden' }, 403))
    await expect(http.get('/admin')).rejects.toMatchObject({
      name: 'HttpError',
      status: 403,
      message: 'forbidden',
    })
  })

  it('on 401 calls authAdapter.logout and the unauthorized handler', async () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    fetchMock.mockResolvedValueOnce(jsonResponse({}, 401))
    await expect(http.get('/private')).rejects.toBeInstanceOf(HttpError)
    expect(authAdapter.logout).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledOnce()
  })

  it('on 401 with skipAuth, does NOT logout or call handler', async () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    fetchMock.mockResolvedValueOnce(jsonResponse({}, 401))
    await expect(http.post('/auth/login', {}, { skipAuth: true })).rejects.toBeInstanceOf(HttpError)
    expect(authAdapter.logout).not.toHaveBeenCalled()
    expect(handler).not.toHaveBeenCalled()
  })

  it('returns null for 204 No Content', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
    const result = await http.delete('/items/1')
    expect(result).toBeNull()
  })
})
