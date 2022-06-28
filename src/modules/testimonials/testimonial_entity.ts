import { metaPaginate } from '../../helpers/paginate'
import { Query } from '../../helpers/types'

export namespace TestimonialEntity {
  export interface Struct {
    id?: string
    name: string
    description: string
    avatar: string
    type: string
    is_active: boolean
    partner_id?: string
    village_id?: string
    created_by?: string
    created_at?: Date
  }

  export interface StructFile {
    id?: number
    name: string
    source: string
    created_at?: Date
  }

  export interface Response {
    id: string
    name: string
    description: string
    is_active: boolean
    avatar: {
      path: string
      source: string
      original_name: string
    }
    type: string
    partner: {
      id: string
      name: string
    }
    village: {
      id: string
      name: string
    }
  }

  export interface RequestQuery extends Query {
    order_by: string
    sort_by: string
    type: string
    is_active: string
    per_page: string
    current_page: string
    q: string
  }

  export interface RequestBody {
    name: string
    description: string
    avatar: string
    avatar_original_name: string
    type: string
    is_active: boolean
    partner_id?: string
    village_id?: string
  }

  type Meta = metaPaginate

  export interface ResponseFindAll {
    data: Response[]
    meta: Meta
  }

  export interface ResponseFindById {
    data: Response
    meta: {}
  }
}
