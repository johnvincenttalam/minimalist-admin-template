import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAuthStore } from '../store/auth-store'
import { RoleGuard } from './role-guard'
import { mockUsers } from '@/features/users/data/mock-users'

describe('RoleGuard', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isRestoring: false })
  })

  it('renders children when the user role is in the allowed list', () => {
    useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true })
    render(<RoleGuard roles={['admin']}>Allowed</RoleGuard>)
    expect(screen.getByText('Allowed')).toBeInTheDocument()
  })

  it('renders the fallback when the user role is not allowed', () => {
    useAuthStore.setState({ user: mockUsers[0], isAuthenticated: true })
    render(
      <RoleGuard roles={[] as never} fallback={<span>Forbidden</span>}>
        Allowed
      </RoleGuard>,
    )
    expect(screen.getByText('Forbidden')).toBeInTheDocument()
    expect(screen.queryByText('Allowed')).not.toBeInTheDocument()
  })

  it('renders nothing by default when there is no user', () => {
    const { container } = render(<RoleGuard roles={['admin']}>Allowed</RoleGuard>)
    expect(container.textContent).toBe('')
  })
})
