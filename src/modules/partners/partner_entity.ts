import { Url } from 'url';
import { Query } from '../../helpers/types';

export namespace Partner {
  export interface Struct {
    id?: string
    name: string
    category_id?: number
    logo?: Url
    verified_at?: Date
    total_village: number
    website?: Url
    deleted_at?: Date
    updated_at?: Date
    created_at?: Date
  }

  export interface RequestQuery extends Query {
    name: string
    per_page: string
    current_page: string
  }

  export interface ResponseFindAll {
    data: Struct[]
    meta: {
      current_page: number
      from: number
      last_page: number
      per_page: number
      to: number
      total: number
      last_update?: Date
    }
  }
}
