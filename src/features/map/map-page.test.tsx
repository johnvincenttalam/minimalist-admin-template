import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Leaflet pokes window/DOM measurement APIs that jsdom only partially
// implements. The page-level chrome (header, list, click handling) is
// what's worth asserting; tile rendering is the library's responsibility.
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  // Real Leaflet popups render only after the marker is clicked; mirroring
  // that here keeps place names from showing up twice (once in the sidebar
  // list, once in an "always-rendered" popup).
  Marker: () => null,
  Popup: () => null,
  useMap: () => ({ flyTo: vi.fn(), getZoom: () => 4 }),
  useMapEvents: () => null,
}))

import { MapPage } from './pages/map-page'

function renderPage() {
  return render(
    <MemoryRouter>
      <MapPage />
    </MemoryRouter>,
  )
}

describe('MapPage', () => {
  it('renders the page header', () => {
    renderPage()
    expect(screen.getByText('Map')).toBeInTheDocument()
  })

  it('shows the location count in the subtitle', () => {
    renderPage()
    expect(screen.getByText(/7 locations/)).toBeInTheDocument()
  })

  it('removes a place when its delete button is clicked', async () => {
    const user = (await import('@testing-library/user-event')).default.setup()
    renderPage()
    const removeBtn = screen.getByRole('button', { name: 'Remove San Francisco HQ' })
    await user.click(removeBtn)
    expect(screen.queryByText('San Francisco HQ')).not.toBeInTheDocument()
    expect(screen.getByText(/6 locations/)).toBeInTheDocument()
  })

  it('renders every mock place in the sidebar list', () => {
    renderPage()
    expect(screen.getByText('San Francisco HQ')).toBeInTheDocument()
    expect(screen.getByText('New York Office')).toBeInTheDocument()
    expect(screen.getByText('Chicago Warehouse')).toBeInTheDocument()
  })
})
