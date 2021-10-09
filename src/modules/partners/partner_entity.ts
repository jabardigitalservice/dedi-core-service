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
    deleted_at?: Date
    updated_at?: Date
    created_at?: Date
  }

  export interface RequestQuery extends Query {
    name: string
    perPage: string
    currentPage: string
  }
}
