export namespace Testimonial {

  export interface Struct {
    id?: string
    caption: string
    created_at: Date
    created_by: string
  }

  export interface TestimonialList {
    id: string
    caption: string
    type: string
    user: {
      id: string
      name: string
      description: string
      avatar: string
    }
  }

  export interface ResponseFindAll {
    data: TestimonialList[]
    meta: Object
  }
}
