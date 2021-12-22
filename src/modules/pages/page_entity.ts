import { metaPaginate } from '../../helpers/paginate';
import { Query } from '../../helpers/types';

export namespace Page {
  export interface Struct {
    id?: number
    user_id: string
    title: string
    description: string
    is_active: boolean
    file_id: number
    created_at?: Date
    updated_at?: Date
  }

  export interface Response {
    id: string
    title: string
    description: string
    is_active: boolean
    file: {
      name: string
      path: string
    }
  }

  export interface RequestQueryPage extends Query {
    order_by: string
    sort_by: string
    q: string
    is_active: string
    per_page: string
    current_page: string
  }

  export interface ResponseFindAll {
    data: Response[]
    meta: metaPaginate
  }

  export interface ResponseFindById {
    data: Response
    meta: object
  }
}
