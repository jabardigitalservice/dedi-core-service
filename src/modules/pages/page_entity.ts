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

  export interface FindAll {
    id: string
    title: string
    description: string
    is_active: boolean
    file: {
      name: string
    }
  }

  export interface RequestQueryPage extends Query {
    order_by: string
    sort_by: string
    q: string
    per_page: string
    current_page: string
  }

  export interface ResponseFindAll {
    data: FindAll[]
    meta: metaPaginate
  }
}
