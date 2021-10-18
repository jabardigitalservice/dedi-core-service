import { metaPaginate } from '../../helpers/paginate';
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

  interface Meta extends metaPaginate {}

  export interface ResponseFindAll {
    data: TestimonialList[]
    meta: Meta
  }
}
