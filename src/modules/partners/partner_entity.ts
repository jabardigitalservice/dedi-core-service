import { metaPaginate } from '../../helpers/paginate';
import { Query } from '../../helpers/types';

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

  interface Meta extends metaPaginate {
    last_update?: Date
  }

  export interface ResponseFindAll {
    data: Struct[]
    meta: Meta
  }

  export interface SuggestionRequestQuery extends Query {
    name: string
  }

  export interface SuggestionPartner {
    id?: string
    name: string
  }

  export interface SuggestionResponse {
    data: SuggestionPartner[]
    meta: {
      total: number
    }
  }
}
