import { metaPagination } from '../../helpers/paginate'
import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Repository } from './testimonial_repository'

export namespace Testimonial {
  export const findAll = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAll> => {
    const items: any = await Repository.findAll({
      type: requestQuery.type,
      per_page: requestQuery.per_page,
      current_page: requestQuery.current_page,
    })

    const result: Entity.ResponseFindAll = {
      data: items.data,
      meta: metaPagination(items.pagination),
    }

    return result
  }

  export const findAllUsingCursor = async (requestQuery: Entity.RequestQueryUsingCursor): Promise<Entity.ResponseFindAllUsingCursor> => {
    const items: any = await Repository.findAllUsingCursor({
      type: requestQuery.type,
      dateBefore: requestQuery?.next_page ? new Date(requestQuery.next_page) : new Date(),
      perPage: Number(requestQuery?.per_page) || 3,
    })

    const result: Entity.ResponseFindAllUsingCursor = {
      data: items,
      meta: {
        next_page: items.length ? items[items.length - 1].created_at : null,
        per_page: items.length || 0,
      },
    }

    return result
  }
}
