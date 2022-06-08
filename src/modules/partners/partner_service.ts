import { getOriginalName, getUrl } from '../../helpers/cloudStorage'
import { metaPagination } from '../../helpers/paginate'
import { Partner as Entity } from './partner_entity'
import { Partner as Repository } from './partner_repository'

export namespace Partner {
  const response = (item: any): Entity.Response => ({
    id: item.id,
    name: item.name,
    total_village: item.total_village,
    logo: {
      path: getUrl(item.logo),
      source: item.logo,
      original_name: getOriginalName(item.file_name),
    },
    created_at: item.created_at,
    website: item.website,
    join_year: item.join_year,
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

    const lastUpdate = await Repository.getLastUpdate()

    const result: Entity.ResponseFindAll = {
      data: responseFindAll(items.data),
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
