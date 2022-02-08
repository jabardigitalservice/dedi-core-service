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

  export interface WithLocation {
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

  export interface Suggestion {
    id: string
    name: string
    city: {
      id: string
      name: string
    }
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

  export interface RequestQueryListWithLocation extends Query {
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

  export interface requestQuerySuggestion {
    name: string
  }

  export interface ResponseWithLocation {
    data: WithLocation[]
    meta: {
      total: number
      last_update?: Date
    }
  }

  export interface ResponseSuggestion {
    data: Suggestion[]
    meta: {
      total: number
    }
  }

  export interface ResponseListWithLocation {
    data: WithLocation[]
    meta: metaPaginate
  }

  export interface ResponseFindById {
    data: FindById
    meta: Object
  }
}
