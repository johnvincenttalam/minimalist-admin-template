import type { Place } from '../types'

export const mockPlaces: Place[] = [
  { id: '1', name: 'San Francisco HQ',  description: 'Headquarters',                lat: 37.7749, lng: -122.4194, category: 'office'    },
  { id: '2', name: 'New York Office',   description: 'East coast operations',       lat: 40.7128, lng:  -74.006,  category: 'office'    },
  { id: '3', name: 'Chicago Warehouse', description: 'Midwest distribution center', lat: 41.8781, lng:  -87.6298, category: 'warehouse' },
  { id: '4', name: 'Austin Partner',    description: 'Local distribution partner',  lat: 30.2672, lng:  -97.7431, category: 'partner'   },
  { id: '5', name: 'Seattle Office',    description: 'Pacific Northwest hub',       lat: 47.6062, lng: -122.3321, category: 'office'    },
  { id: '6', name: 'Miami Warehouse',   description: 'Southeast distribution',      lat: 25.7617, lng:  -80.1918, category: 'warehouse' },
  { id: '7', name: 'Denver Partner',    description: 'Mountain region partner',     lat: 39.7392, lng: -104.9903, category: 'partner'   },
]
