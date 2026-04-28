import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotificationsPage } from './pages/notifications-page'

function renderPage() {
  return render(
    <MemoryRouter>
      <NotificationsPage />
    </MemoryRouter>,
  )
}

describe('NotificationsPage', () => {
  it('renders the page header', () => {
    renderPage()
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('shows mock notifications', () => {
    renderPage()
    expect(screen.getByText('New user registered')).toBeInTheDocument()
    expect(screen.getByText('High CPU usage detected')).toBeInTheDocument()
  })

  it('renders filter chips', () => {
    renderPage()
    expect(screen.getByText('All types')).toBeInTheDocument()
    expect(screen.getByText('Info')).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })
})
