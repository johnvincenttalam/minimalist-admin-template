import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Place } from '../types'

/**
 * MapView — the only file in the feature that knows about Leaflet.
 *
 * To swap providers later (Mapbox, Google, etc.), rewrite this file
 * preserving the props contract. The page composes <MapView places={...} />
 * and is provider-agnostic.
 */

// Inline SVG marker that picks up the `text-accent` Tailwind class via
// `currentColor` — keeps marker color in sync with the active accent preset
// and avoids shipping the default Leaflet PNGs (which don't resolve under Vite).
function makeAccentIcon() {
  return L.divIcon({
    className: 'map-accent-marker',
    html: `
      <span class="text-accent" style="display:inline-flex;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.25));">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.2" stroke-linejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
        </svg>
      </span>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  })
}

interface FlyToProps {
  center?: [number, number]
  zoom?: number
}

function FlyToWhenChanged({ center, zoom }: FlyToProps) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.6 })
  }, [center, zoom, map])
  return null
}

function MapClickCapture({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface MapViewProps {
  places: Place[]
  /** Initial map center. Defaults to the geographic center of the continental US. */
  center?: [number, number]
  /** Initial zoom. */
  zoom?: number
  /** When changed, the map smoothly flies to this location. */
  flyTo?: [number, number]
  flyZoom?: number
  onSelectPlace?: (place: Place) => void
  /** Fires on every map click. Coordinates are the clicked lat/lng. */
  onMapClick?: (lat: number, lng: number) => void
  className?: string
}

export function MapView({
  places,
  center = [39.5, -98.35],
  zoom = 4,
  flyTo,
  flyZoom,
  onSelectPlace,
  onMapClick,
  className,
}: MapViewProps) {
  // CartoDB Voyager — light, clean basemap with strong contrast.
  // For dark mode swap to: https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png
  // (See docs/dark-mode-patterns.md — maps are intentionally not auto-darkened.)
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
  const tileAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

  return (
    <div className={className}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer url={tileUrl} attribution={tileAttribution} />
        <FlyToWhenChanged center={flyTo} zoom={flyZoom} />
        <MapClickCapture onMapClick={onMapClick} />
        {places.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={makeAccentIcon()}
            eventHandlers={{ click: () => onSelectPlace?.(p) }}
          >
            <Popup>
              <div className="min-w-[140px]">
                <p className="text-[13px] font-semibold text-zinc-900">{p.name}</p>
                {p.description && <p className="text-[12px] text-zinc-500 mt-0.5">{p.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
