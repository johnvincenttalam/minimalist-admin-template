import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '../store/auth-store'
import { GuestRoute } from './guest-route'
import { mockUsers } from '@/features/users/data/mock-users'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <div>Login Page</div>
            </GuestRoute>
          }
        />
        <Route path="/admin" element={<div>Admin Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('GuestRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isRestoring: false })
  })

  it('shows the loading state while the session restores', () => {
    useAuthStore.setState({ isRestoring: true })
    renderAt('/login')
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
  })

  it('renders children when not authenticated', () => {
    renderAt('/login')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('redirects already-authenticated users to their default route', () => {
    useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true })
    renderAt('/login')
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })
})
