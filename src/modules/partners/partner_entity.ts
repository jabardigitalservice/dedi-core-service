import { metaPaginate } from '../../helpers/paginate'
import { Query } from '../../helpers/types'

export namespace PartnerEntity {
  export interface Struct {
    id?: string
    name: string
    category_id?: number
    logo?: string
    verified_at?: Date
    total_village: number
    join_year?: string
    website?: string
    deleted_at?: Date
    updated_at?: Date
    created_at?: Date
  }

  export interface Response {
    id: string
    name: string
    total_village: number
    logo: {
      path: string
      source: string
      original_name: string
    }
    created_at: Date
    website: string
    join_year: string
  }

  export interface RequestQuery extends Query {
    name: string
    is_verified: string
    per_page: string
    current_page: string
  }

  interface Meta extends metaPaginate {
    last_update?: Date
  }

  export interface ResponseFindAll {
    data: Response[]
    meta: Meta
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
