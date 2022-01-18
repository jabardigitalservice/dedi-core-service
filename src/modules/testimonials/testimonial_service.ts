import { metaPagination } from '../../helpers/paginate'
import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Repository } from './testimonial_repository'

export namespace Testimonial {
  const response = (item: any): Entity.Response => ({
    id: item.id,
    name: item.name,
    description: item.description,
    avatar: item.avatar,
    type: item.type,
    partner: {
      id: item.partner_id,
      name: item.partner_name,
    },
    village: {
      id: item.village_id,
      name: item.village_name,
    },
  })

  const responseFindAll = (items: any[]): Entity.Response[] => {
    const data: Entity.Response[] = []
    for (const item of items) {
      data.push(response(item))
    }

    return data
  }

  export const findAll = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAll> => {
    const items: any = await Repository.findAll(requestQuery)

    const result: Entity.ResponseFindAll = {
      data: responseFindAll(items.data),
      meta: metaPagination(items.pagination),
    }

    return result
  }
}
