import { metaPagination } from '../../helpers/paginate'
import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Repository } from './testimonial_repository'

export namespace Testimonial {
  export const findAll = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAll> => {
    const items: any = await Repository.findAll({
      type: requestQuery.type,
      per_page: requestQuery.per_page,
      current_page: requestQuery.current_page
    })

    const result: Entity.ResponseFindAll = {
      data: items.data,
      meta: metaPagination(items.pagination)
    }

    return result
  }
}
