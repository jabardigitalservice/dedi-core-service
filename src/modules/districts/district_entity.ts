import { Query } from '../../helpers/types'

export namespace District {
  export interface Struct {
    id: string
    name: string
    city_id: string
    is_active: boolean
    area_id?: string
    location: any
  }

  export interface WithLocation {
    id: string
    name: string
    city: {
      id: string
      name: string
    }
    location: {
      lat: number
      lng: number
    }
  }

  export interface RequestQueryWithLocation extends Query {
    bounds: {
      ne: string
      sw: string
    }
  }

  export interface Suggestion {
    id: string
    name: string
  }

  export interface RequestQuerySuggestion extends Query {
    name: string
    is_active: string
    city_id: string
  }

  export interface ResponseWithLocation {
    data: WithLocation[]
    meta: {
      total: number
    }
  }

  export interface ResponseSuggestion {
    data: Suggestion[]
    meta: {
      total: number
    }
  }
}
