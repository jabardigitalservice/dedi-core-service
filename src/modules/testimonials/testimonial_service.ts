import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Repository } from './testimonial_repository'

export namespace Testimonial {
  export const findAll = (): Entity.ResponseFindAll => {
    const items = Repository.findAll()

    const data: Entity.TestimonialList[] = []

    for (const item of items) {
      data.push({
        id: item.id,
        caption: item.caption,
        type: item.type,
        user: {
          id: item.user_id,
          name: item.user_name,
          description: item.user_description,
          avatar: item.user_avatar
        }
      })
    }

    return {
      data: data, meta: {}
    }
  }
}
