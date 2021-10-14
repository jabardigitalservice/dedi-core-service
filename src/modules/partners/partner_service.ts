import { Partner as Entity } from './partner_entity'
import { Partner as Repository } from './partner_repository'

export namespace Partner {
  export const findAll = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAll> => {
    const items: any = await Repository.findAll({
      name: requestQuery.name,
      per_page: requestQuery.per_page,
      current_page: requestQuery.current_page
    })

    const result: Entity.ResponseFindAll = {
      data: items.data,
      meta: {
        last_update: items.data.length ? items.data[0].created_at : null,
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
