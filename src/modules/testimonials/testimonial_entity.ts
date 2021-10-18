import { Query } from '../../helpers/types';

export namespace Testimonial {

  export interface Struct {
    id?: string
    caption: string
    created_at?: Date
    created_by: string
  }

  export interface TestimonialList {
    id: string
    caption: string
    user: {
      id: string
      name: string
      type: string
      description: string
      avatar: string
    }
  }

  export interface RequestQuery extends Query {
    per_page: string,
    current_page: string
  }

  export interface ResponseFindAll {
    data: TestimonialList[]
    meta: {
      current_page: number
      from: number
      last_page: number
      per_page: number
      to: number
      total: number
    }
  }
}
