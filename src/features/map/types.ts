export type PlaceCategory = 'office' | 'warehouse' | 'partner' | 'other'

export interface Place {
  id: string
  name: string
  description?: string
  lat: number
  lng: number
  category: PlaceCategory
}
