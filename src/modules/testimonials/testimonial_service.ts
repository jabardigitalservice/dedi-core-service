import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Repository } from './testimonial_repository'

export namespace Testimonial {
  export const findAll = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAll> => {
    const items: any = await Repository.findAll({
      name: requestQuery.name,
      per_page: requestQuery.per_page,
      current_page: requestQuery.current_page
    })

    const data: Entity.TestimonialList[] = []

    for (const item of items.data) {
      data.push({
        id: item.id,
        caption: item.caption,
        user: {
          id: item.user_id,
          name: item.user_name,
          type: item.user_type,
          description: item.user_description,
          avatar: item.user_avatar
        }
      })
    }

    const result: Entity.ResponseFindAll = {
      data: data,
      meta: {
        current_page: items.pagination.currentPage,
        from: items.pagination.from,
        last_page: items.pagination.lastPage || 0,
        per_page: items.pagination.perPage,
        to: items.pagination.to,
        total: items.pagination.total || 0,
      }
    }

    return result
  }
}
