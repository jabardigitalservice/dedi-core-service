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
    created_by: string
    created_at?: Date
  }

  export interface RequestQuery extends Query {
    type: string
    per_page: string
    current_page: string
  }

  interface Meta extends metaPaginate { }

  export interface ResponseFindAll {
    data: Struct[]
    meta: Meta
  }
}
