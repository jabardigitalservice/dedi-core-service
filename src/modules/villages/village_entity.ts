import { metaPaginate } from '../../helpers/paginate';
import { Query } from '../../helpers/types';

export namespace Village {
  export interface Struct {
    id: string
    name: string
    district_id: string
    area_id?: string
    category_id?: number
    level?: number
    status?: string
    location: any
    images: string
    is_active: boolean
    updated_at: Date
  }

  export interface Location {
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

  export interface FindById {
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
  }

  export interface RequestQueryListLocation extends Query {
    name: string
    level: string
    per_page: string
    current_page: string
  }

  export interface RequestQueryWithLocation extends Query {
    bounds: {
      ne: string
      sw: string
    }
  }

  export interface RequestParamFindById {
    id: string
  }

  export interface ResponseWithLocation {
    data: Location[]
    meta: {
      total: number
      last_update?: Date
    }
  }

  export interface ResponseListLocation {
    data: Location[]
    meta: metaPaginate
  }

  export interface ResponseFindById {
    data: FindById
    meta: Object
  }
}
