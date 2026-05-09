import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '../store/auth-store'
import { ProtectedRoute } from './protected-route'
import { mockUsers } from '@/features/users/data/mock-users'

function renderAt(path: string, allowedRoles?: ('admin')[]) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isRestoring: false })
  })

  it('shows the loading state while the session restores', () => {
    useAuthStore.setState({ isRestoring: true })
    renderAt('/admin')
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('redirects unauthenticated users to /login', () => {
    renderAt('/admin')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders children when authenticated and the role is allowed', () => {
    useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true })
    renderAt('/admin', ['admin'])
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects when the user role is not in allowedRoles', () => {
    useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true })
    renderAt('/admin', [] as never)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
