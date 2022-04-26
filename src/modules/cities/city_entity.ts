import database from '../../config/database';
import { Query } from '../../helpers/types';

export namespace City {
  export interface Struct {
    id: string
    name: string
    is_active: boolean
    area_id?: string
    location: any
  }

  export const Cities = () => database<Struct>('cities')

  export interface WithLocation {
    id: string
    name: string
    location: {
      lat: number
      lng: number
    },
  }

  export interface RequestQueryWithLocation extends Query {
    bounds: {
      ne: string
      sw: string
    }
  }

  export interface ResponseWithLocation {
    data: WithLocation[]
    meta: {
      total: number
    }
  }
}
