import { metaPaginate } from '../../helpers/paginate'
import { Query } from '../../helpers/types'

export namespace Partner {
  export interface Struct {
    id?: string
    name: string
    category_id?: number
    logo?: string
    verified_at?: Date
    total_village: number
    website?: string
    deleted_at?: Date
    updated_at?: Date
    created_at?: Date
  }

  export interface RequestQuery extends Query {
    name: string
    per_page: string
    current_page: string
  }

  export interface RequestQueryUsingCursor extends Query {
    name?: string
    next_page?: string
    per_page?: string
  }

  export interface QueryUsingCursor {
    name: string
    dateBefore: Date
    perPage: number
  }

  interface Meta extends metaPaginate {
    last_update?: Date
  }

  export interface ResponseFindAll {
    data: Struct[]
    meta: Meta
  }

  export interface ResponseFindAllUsingCursor {
    data: Struct[]
    meta: {
      next_page: string
      per_page: number
      last_update?: Date
    }
  }

  export interface RequestQuerySuggestion extends Query {
    name: string
  }

  export interface PartnerSuggestion {
    id?: string
    name: string
  }

  export interface ResponseSuggestion {
    data: PartnerSuggestion[]
    meta: {
      total: number
    }
  }
}
