import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { KanbanPage } from './pages/kanban-page'

function renderPage() {
  return render(
    <MemoryRouter>
      <KanbanPage />
    </MemoryRouter>,
  )
}

describe('KanbanPage', () => {
  it('renders the page header', () => {
    renderPage()
    expect(screen.getByText('Kanban Board')).toBeInTheDocument()
  })

  it('shows all four column headers', () => {
    renderPage()
    expect(screen.getByText('Backlog')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders mock tasks', () => {
    renderPage()
    expect(screen.getByText('Set up CI/CD pipeline')).toBeInTheDocument()
    expect(screen.getByText('Implement search feature')).toBeInTheDocument()
  })
})
