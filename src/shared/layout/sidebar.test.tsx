import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './sidebar'

// Control which features are "enabled" for each test
vi.mock('@/config/features', async () => {
  return {
    features: {
      dashboard: true,
      charts: true,
      table: true,
      forms: true,
      users: true,
      roles: true,
      activity: true,
      notifications: true,
      calendar: true,
      kanban: true,
      profile: true,
      uiKit: true,
      settings: true,
    },
    isFeatureEnabled: (key: string) => enabledFlags[key] ?? false,
  }
})

let enabledFlags: Record<string, boolean> = {}

function renderSidebar() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Sidebar
        collapsed={false}
        mobileOpen={false}
        onToggleCollapse={() => {}}
        onCloseMobile={() => {}}
      />
    </MemoryRouter>,
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    enabledFlags = {
      dashboard: true, charts: true, table: true, forms: true,
      users: true, roles: true, activity: true, notifications: true,
      calendar: true, kanban: true, profile: true,
      uiKit: true, settings: true,
    }
  })

  it('renders all nav items when every feature is enabled', () => {
    renderSidebar()
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /charts/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  it('filters out items whose feature is disabled', () => {
    enabledFlags.charts = false
    enabledFlags.activity = false
    renderSidebar()
    expect(screen.queryByRole('link', { name: /charts/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /activity/i })).not.toBeInTheDocument()
    // Others still visible
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
  })
})
