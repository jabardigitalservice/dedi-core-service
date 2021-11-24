import { Query } from '../../helpers/types';

export namespace City {
  export interface Struct {
    id: string
    name: string
    is_active: boolean
    area_id?: string
    location: any
  }

  export interface FindAllWithLocation {
    id: string
    name: string
    location: {
      lat: number
      lng: number
    },
  }

  export interface RequestQuery extends Query {
    name: string
    bounds: {
      ne: string
      sw: string
    }
  }

  export interface ResponseFindAllWithLocation {
    data: FindAllWithLocation[]
    meta: {
      total: number
    }
  }
}
