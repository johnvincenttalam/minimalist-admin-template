import { env } from '@/shared/env'
import { authAdapter } from '@/features/auth/adapters'

/**
 * Optional handler invoked when a request returns 401. Wired up once at app
 * boot from inside the router context (see AppProviders) so we can use
 * react-router navigate instead of a full-page reload.
 *
 * If unset (e.g. in tests), the request just throws HttpError as usual.
 */
let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(fn: (() => void) | null) {
  unauthorizedHandler = fn
}

/**
 * Thrown for any non-2xx response. Includes status and the parsed body (if JSON).
 */
export class HttpError extends Error {
  readonly status: number
  readonly statusText: string
  readonly body?: unknown

  constructor(status: number, statusText: string, message: string, body?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.body = body
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  /** Query params appended to the URL. Skip null/undefined values. */
  params?: Record<string, string | number | boolean | null | undefined>
  /** JSON body — serialized automatically. For form data / raw bodies pass via RequestInit. */
  body?: unknown
  /** Skip the Authorization header for this call (e.g. login). Defaults to false. */
  skipAuth?: boolean
}

function buildUrl(path: string, params?: RequestOptions['params']) {
  const base = env.apiUrl.replace(/\/$/, '')
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`
  if (!params) return url

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue
    search.append(key, String(value))
  }
  const qs = search.toString()
  return qs ? `${url}?${qs}` : url
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) return response.json()
  if (response.status === 204) return null
  const text = await response.text()
  return text || null
}

async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, skipAuth, headers, ...rest } = options

  const finalHeaders = new Headers(headers)
  if (body !== undefined && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json')
  }
  if (!skipAuth) {
    const token = authAdapter.getToken()
    if (token && !finalHeaders.has('Authorization')) {
      finalHeaders.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(buildUrl(path, params), {
    ...rest,
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    if (response.status === 401 && !skipAuth) {
      await authAdapter.logout()
      // Prefer the router-aware handler (registered by AppProviders) so we
      // don't hard-reload and lose React Router state. Fall back to a hard
      // redirect only if no bridge is wired (e.g. http used outside a React
      // tree, or the bridge hasn't mounted yet).
      if (unauthorizedHandler) {
        unauthorizedHandler()
      } else if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    const errorBody = await parseBody(response).catch(() => null)
    const message =
      (errorBody && typeof errorBody === 'object' && 'message' in errorBody && typeof errorBody.message === 'string'
        ? errorBody.message
        : null) ?? `${response.status} ${response.statusText}`
    throw new HttpError(response.status, response.statusText, message, errorBody)
  }

  return (await parseBody(response)) as T
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}
