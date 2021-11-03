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
    const result: Entity.ResponseFindAll = {
      data: items.data,
      meta: {
        ...metaPagination(items.pagination),
        last_update: items.data.length ? items.data[0].created_at : null,
      }
    }

    return result
  }

  export const search = async (requestQuery: Entity.SuggestionRequestQuery): Promise<Entity.SuggestionResponse> => {
    const partners: Entity.SuggestionResponsePartner[] = requestQuery?.name?.length >= 3 ? await Repository.search(requestQuery) : []

    const result: Entity.SuggestionResponse = {
      data: partners,
      meta: {
        total: partners.length
      }
    }

    return result
  }
}
