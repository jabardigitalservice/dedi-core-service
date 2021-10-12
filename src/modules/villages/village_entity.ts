export namespace Village {
  export interface Struct {
    id: string
    name: string
    district_id: string
    area_id?: string
    category_id?: number
    level?: number
    status?: string
    location: object
    images: JSON
    is_active: boolean
  }

  export interface ResponseFindAllWithLocation {
    id: string
    name: string
    level: number
    city: {
      id: string
      name: string
    },
    category: {
      id: number
      name: string
    },
    location: {
      lat: number
      lng: number
    },
    images: string[]
  }
}
