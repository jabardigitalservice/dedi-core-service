import database from '../../config/database';
import { metaPaginate } from '../../helpers/paginate';
import { Query } from '../../helpers/types';

export namespace User {

  export interface Struct {
    id?: string
    name: string
    partner_id?: string
    avatar?: string
    email: string
    password?: string
    is_admin?: boolean
    is_active?: boolean
    google_id?: string
    created_at?: Date
    updated_at?: Date
    verified_at?: Date
    last_login_at?: Date
  }

  export interface StructFile {
    id?: number
    name: string
    source: string
    created_at?: Date
  }

  export const Users = () => database<Struct>('users')
  export const Files = () => database<StructFile>('files')

  export interface Response {
    id: string
    name: string
    email: string
    role: string
    avatar: {
      path: string
      source: string
      original_name: string
    }
    is_active: boolean
    created_at?: Date
    updated_at?: Date
    last_login_at?: Date
  }

  export interface RequestQuery extends Query {
    order_by: string
    sort_by: string
    is_admin: string
    is_active: string
    per_page: string
    current_page: string
    q: string
  }

  export interface RequestBody {
    name: string
    email: string
    password?: string
    avatar: string
    avatar_original_name: string
  }

  export interface RequestBodyUpdateStatus {
    is_active: boolean
  }

  interface Meta extends metaPaginate { }

  export interface ResponseFindAll {
    data: Response[]
    meta: Meta
  }

  export interface ResponseFindById {
    data: Response
    meta: {}
  }
}
