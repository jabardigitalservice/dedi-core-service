export namespace Testimonial {

  export interface Struct {
    id?: string
    caption: string
    created_at: Date
    created_by: string
  }

  export interface ResponseFindAll {
    id: string
    caption: string
    type: string
    user: {
      id: string
      name: string
      description: string
      avatar: string
    },
  }

}
