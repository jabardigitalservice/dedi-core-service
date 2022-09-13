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

  export interface RequestBodyQuestionnaire {
    id?: string
    level: number
    properties: string
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
    level: number
    status: string
    created_at: Date
  }

  type Meta = metaPaginate

  export interface ResponseFindAll {
    data: FindAll[]
    meta: Meta
  }

  export interface RequestQueryFindAll extends Query {
    order_by: string
    sort_by: string
    level: string
    per_page: string
    current_page: string
    q: string
  }
}
