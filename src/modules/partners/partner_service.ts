import { metaPagination } from '../../helpers/paginate'
import { Partner as Entity } from './partner_entity'
import { Partner as Repository } from './partner_repository'

export namespace Partner {
  export const findAll = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAll> => {
    const items: any = await Repository.findAll(requestQuery)

    const lastUpdate = await Repository.getLastUpdate()

    const result: Entity.ResponseFindAll = {
      data: items.data,
      meta: {
        ...metaPagination(items.pagination),
        last_update: lastUpdate?.created_at || null,
      },
    }

    return result
  }

  export const suggestion = async (requestQuery: Entity.RequestQuerySuggestion): Promise<Entity.ResponseSuggestion> => {
    const partners: Entity.PartnerSuggestion[] = await Repository.suggestion(requestQuery)

    const result: Entity.ResponseSuggestion = {
      data: partners,
      meta: {
        total: partners.length,
      },
    }

    return result
  }
}
