import { metaPaginate } from '../../helpers/paginate'
import { Query } from '../../helpers/types'

export namespace QuestionnaireEntity {
  export interface Questionnaire {
    id?: number
    village_id: string
    level: number
    status?: string
    updated_at?: Date
    created_at?: Date
    properties: string
  }

  export interface VillageCategory {
    id?: number
    category_id?: number
    village_id?: string
    is_verify: boolean
  }

  export interface Category {
    id?: number
    name: string
    level: number
    is_active: boolean
  }

  export interface RequestBodyQuestionnaire {
    id: string
    level: number
    sk: {
      path: string
      source: string
      original_name: string
    }
    properties: Properties
  }

  export interface FindAll {
    id: number
    village: {
      name: string
    }
    district: {
      name: string
    }
    city: {
      name: string
    }
    category: {
      name?: string
    }
    level: number
    status: string
    created_at: Date
  }

  export interface FindById extends FindAll {
    properties: Properties
  }

  type Meta = metaPaginate

  export interface ResponseFindAll {
    data: FindAll[]
    meta: Meta
  }

  export interface ResponseFindById {
    data: FindById
    meta: object
  }

  export interface RequestQueryFindAll extends Query {
    order_by: string
    sort_by: string
    level: string
    per_page: string
    current_page: string
    q: string
  }

  export interface Properties {
    applicant: Applicant
    facility: Facility
    literacy: Literacy
    business: Business
    potential: Potential
  }

  export interface Applicant {
    name: string
    position: string
    phone_number: string
    email: string
  }

  export interface Business {
    social_media: SocialMedia
    bumdes: Bumdes
    commodity: Commodity
    ecommerce: Ecommerce
    logistics: string
  }

  export interface Bumdes {
    data: string
    photo: Photo
    name: string
  }

  export interface Photo {
    path: null
    original_name: null
    source: null
  }

  export interface Commodity {
    data: string
    photo: Photo
    productivity: string
  }

  export interface Ecommerce {
    data: string[]
    other_ecommerce: string
    distribution: string
  }

  export interface SocialMedia {
    data: string[]
    photo: Photo
  }

  export interface Facility {
    vehicle_access: SocialMedia
    power_supply: PowerSupply
    cellular_network: CellularNetwork
    internet_network: InternetNetwork
  }

  export interface CellularNetwork {
    data: string
    photo: Photo
    operator: string
  }

  export interface InternetNetwork {
    data: string
    photo: Photo
    website: string
  }

  export interface PowerSupply {
    data: string
    photo: Photo
  }

  export interface Literacy {
    community: SocialMedia
    training: Training
  }

  export interface Training {
    data: string
    photo: Photo
    training: string
  }

  export interface Potential {
    data: string[]
    other_potential: string
    growth_potential: null
    photo: Photo
  }
}
