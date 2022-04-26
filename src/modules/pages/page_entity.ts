import database from '../../config/database';
import { metaPaginate } from '../../helpers/paginate';
import { Query } from '../../helpers/types';

export namespace Page {
  export interface Struct {
    id?: number
    created_by?: string
    title: string
    link: string
    order: number
    is_active: boolean
    image: string
    created_at?: Date
    updated_at?: Date
  }

  export interface StructFile {
    id?: number
    name: string
    source: string
    created_at?: Date
  }

  export const Pages = () => database<Struct>('pages')
  export const Files = () => database<StructFile>('files')

  export interface Response {
    id: string
    title: string
    link: string
    is_active: boolean
    order: number
    image: {
      path: string
      source: string
      original_name: string
    }
  }

  export interface RequestQuery extends Query {
    order_by: string
    sort_by: string
    q: string
    is_active: string
    per_page: string
    current_page: string
  }

  export interface RequestBody {
    title: string
    link: string
    is_active: boolean
    order: number
    image: string
    image_original_name: string
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
