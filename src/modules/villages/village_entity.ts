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
  }

  export interface FindAllWithLocation {
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

  export interface RequestQuery extends Query {
    name: string
    level: string
  }

  export interface RequestQuerySearch extends Query {
    q: string
  }

  export interface RequestParamFindById {
    id: string
  }

  export interface ResponseFindAllWithLocation {
    data: FindAllWithLocation[]
    meta: {
      total: number
    }
  }

  export interface ResponseFindById {
    data: FindById
    meta: Object
  }
}
