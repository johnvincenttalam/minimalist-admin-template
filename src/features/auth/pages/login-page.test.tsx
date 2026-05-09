import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
  Toaster: () => null,
}))

import { LoginPage } from './login-page'
import { useAuthStore } from '../store/auth-store'
import { authAdapter } from '../adapters'
import { mockUsers } from '@/features/users/data/mock-users'

vi.mock('../adapters', async () => {
  const real = await vi.importActual<typeof import('../adapters')>('../adapters')
  return {
    ...real,
    authAdapter: {
      login: vi.fn(),
      logout: vi.fn(async () => {}),
      getCurrentUser: vi.fn(async () => null),
      getToken: vi.fn(() => null),
    },
  }
})

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<div>Admin Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isRestoring: false })
    vi.mocked(authAdapter.login).mockReset()
  })

  it('renders email, password, and submit', () => {
    renderLogin()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('navigates to /admin on successful login', async () => {
    vi.mocked(authAdapter.login).mockResolvedValueOnce(mockUsers[0])
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText(/email/i), mockUsers[0].email)
    await user.type(screen.getByPlaceholderText(/password/i), 'anything')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    })
  })

  it('shows an inline error on bad credentials', async () => {
    vi.mocked(authAdapter.login).mockResolvedValueOnce(null)
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText(/email/i), 'nobody@example.com')
    await user.type(screen.getByPlaceholderText(/password/i), 'whatever')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument()
    })
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
  })

  it('rejects empty password via Zod validation before calling the adapter', async () => {
    // Email input uses type="email" which jsdom validates natively, blocking
    // submit before Zod runs. Password has no `required` attribute, so Zod's
    // `min(1)` is the actual gate — that's what we exercise here.
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText(/email/i), 'good@example.com')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
    expect(authAdapter.login).not.toHaveBeenCalled()
  })

  it('demo account button fills the form', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: /admin@example\.com/i }))

    expect(screen.getByPlaceholderText(/email/i)).toHaveValue('admin@example.com')
    expect(screen.getByPlaceholderText(/password/i)).toHaveValue('demo123')
  })
})
