import { metaPagination } from '../../helpers/paginate'
import { Partner as Entity } from './partner_entity'
import { Partner as Repository } from './partner_repository'

export namespace Partner {
  export const findAll = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAll> => {
    const items: any = await Repository.findAll({
      name: requestQuery.name,
      per_page: requestQuery.per_page,
      current_page: requestQuery.current_page
    })

    const lastUpdate = await Repository.getLastUpdate()

    const result: Entity.ResponseFindAll = {
      data: items.data,
      meta: {
        ...metaPagination(items.pagination),
        last_update: lastUpdate ? lastUpdate.created_at : null,
      }
    }

    return result
  }

  export const search = async (requestQuery: Entity.RequestQuerySuggestion): Promise<Entity.ResponseSuggestion> => {
    const partners: Entity.PartnerSuggestion[] = requestQuery?.name?.length >= 3 ? await Repository.search(requestQuery) : []

    const result: Entity.ResponseSuggestion = {
      data: partners,
      meta: {
        total: partners.length
      }
    }

    return result
  }
}
