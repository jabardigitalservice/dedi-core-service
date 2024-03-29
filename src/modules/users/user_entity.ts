import { metaPaginate } from '../../helpers/paginate'
import { Query } from '../../helpers/types'

export namespace UserEntity {
  export interface User {
    id?: string
    name: string
    partner_id?: string
    avatar?: string
    email: string
    password?: string
    is_admin?: boolean
    is_active?: boolean
    is_village_apparatus?: boolean
    village_id?: string
    google_id?: string
    created_at?: Date
    updated_at?: Date
    verified_at?: Date
    last_login_at?: Date
    status?: string
    notes?: string
  }

  export interface File {
    id?: number
    name: string
    source: string
    created_at?: Date
  }

  export interface Partner {
    id: string
    name: string
    deleted_at?: Date
    created_at: Date
  }

  export interface Response {
    id: string
    name: string
    email: string
    role: string
    partner: {
      name: string
    }
    city: {
      name: string
    }
    district: {
      name: string
    }
    village: {
      name: string
    }
    avatar: {
      path: string
      source: string
      original_name: string
    }
    is_active: boolean
    created_at?: Date
    updated_at?: Date
    status?: string
    last_login_at?: Date
  }

  export interface RequestQuery extends Query {
    order_by: string
    sort_by: string
    is_admin: string
    roles: string
    is_active: string
    per_page: string
    current_page: string
    q: string
  }

  export interface RequestBody {
    name: string
    email: string
    password?: string
    company?: string
    roles: string
    avatar: string
    avatar_original_name: string
  }

  export interface RequestBodyUpdateStatus {
    is_active: boolean
    status?: string
  }

  export interface Verify {
    notes?: string
    status?: string
    is_active?: boolean
  }

  export interface RequestBodyVerify {
    is_verify: boolean
    notes?: string
  }

  type Meta = metaPaginate

  export interface ResponseFindAll {
    data: Response[]
    meta: Meta
  }

  export interface ResponseFindById {
    data: Response
    meta: {}
  }

  export interface Email {
    subject: string
    html: string
  }
}
