import { Partner as Entity } from './partner_entity'
import { Partner as Repository } from './partner_repository'

export namespace Partner {
  export const findAll = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAll> => {
    const items: any = await Repository.findAll({
      name: requestQuery.name,
      perPage: requestQuery.perPage,
      currentPage: requestQuery.currentPage
    })

    const result: Entity.ResponseFindAll = {
      data: items.data,
      meta: {
        last_updated: items.data.length > 0 ? items.data[0].created_at : null,
        ...items.pagination
      }
    }

    return result
  }
}
