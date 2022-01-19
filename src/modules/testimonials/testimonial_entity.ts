import { metaPaginate } from '../../helpers/paginate';
import { Query } from '../../helpers/types';

export namespace Testimonial {

  export interface Struct {
    id?: string
    name: string
    description: string
    avatar: string
    type: string
    is_active: boolean
    partner_id?: string
    village_id?: string
    created_by: string
    created_at?: Date
  }

  export interface Response {
    id: string
    name: string
    description: string
    avatar: string
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
  }

  export interface RequestBody {
    name: string
    description: string
    avatar: string
    type: string
    is_active: string
    partner_id?: string
    village_id?: string
  }

  interface Meta extends metaPaginate { }

  export interface ResponseFindAll {
    data: Response[]
    meta: Meta
  }
}
