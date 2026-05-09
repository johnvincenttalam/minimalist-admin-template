import { useState } from 'react'
import { Building2, Warehouse, Handshake, MapPin, X } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/shared/ui/page-header'
import { Card, CardContent } from '@/shared/ui/card'
import { IconTile } from '@/shared/ui/icon-tile'
import { useLocalStorageState } from '@/shared/hooks/use-local-storage-state'
import { cn } from '@/shared/utils/cn'
import { MapView } from '../components/map-view'
import { mockPlaces } from '../data/mock-places'
import type { Place, PlaceCategory } from '../types'

const categoryMeta: Record<PlaceCategory, { icon: typeof Building2; tone: 'blue' | 'amber' | 'emerald' | 'zinc' }> = {
  office:    { icon: Building2, tone: 'blue'    },
  warehouse: { icon: Warehouse, tone: 'amber'   },
  partner:   { icon: Handshake, tone: 'emerald' },
  other:     { icon: MapPin,    tone: 'zinc'    },
}

export function MapPage() {
  const [places, setPlaces] = useLocalStorageState<Place[]>('map-places', mockPlaces)
  const [selected, setSelected] = useState<Place | null>(null)

  const addPlaceAt = (lat: number, lng: number) => {
    const id = crypto.randomUUID()
    const customCount = places.filter((p) => p.category === 'other').length
    const newPlace: Place = {
      id,
      name: `New location ${customCount + 1}`,
      description: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      lat,
      lng,
      category: 'other',
    }
    setPlaces((prev) => [...prev, newPlace])
    setSelected(newPlace)
    toast.success('Location added', { description: 'Click the × in the list to remove it.' })
  }

  const removePlace = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id))
    setSelected((prev) => (prev?.id === id ? null : prev))
  }

  return (
    <div>
      <PageHeader title="Map" subtitle={`${places.length} locations · click anywhere on the map to add one`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sidebar list */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardContent className="p-0 max-h-[calc(100vh-220px)] overflow-y-auto">
            <div role="list">
              {places.map((p, i) => {
                const meta = categoryMeta[p.category]
                const isSelected = selected?.id === p.id
                return (
                  <div
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Show ${p.name} on map`}
                    aria-pressed={isSelected}
                    onClick={() => setSelected(p)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(p) }
                    }}
                    className={cn(
                      'group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent/30',
                      i !== places.length - 1 && 'border-b border-zinc-100/60',
                      isSelected && 'bg-zinc-50',
                    )}
                  >
                    <IconTile icon={meta.icon} tone={meta.tone} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-zinc-900 truncate">{p.name}</p>
                      {p.description && <p className="text-[12px] text-zinc-400 truncate">{p.description}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removePlace(p.id) }}
                      aria-label={`Remove ${p.name}`}
                      className="p-1 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Map — wrapped in surface-paper so it stays light in dark mode
            (per docs/dark-mode-patterns.md, Bug 8 — maps are data surfaces, not chrome). */}
        <Card className="lg:col-span-2 surface-paper overflow-hidden">
          <CardContent className="p-0">
            <MapView
              places={places}
              flyTo={selected ? [selected.lat, selected.lng] : undefined}
              flyZoom={selected ? 7 : undefined}
              onSelectPlace={setSelected}
              onMapClick={addPlaceAt}
              className="h-[calc(100vh-220px)]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
