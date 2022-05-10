import { isRequestBounds } from '../../helpers/polygon'
import { City as Entity } from './city_entity'
import { City as Repository } from './city_repository'

export namespace City {
  const responseWithLocation = (items: any[]): Entity.WithLocation[] => {
    const data: Entity.WithLocation[] = []
    for (const item of items) {
      data.push({
        id: item.id,
        name: item.name,
        location: {
          lat: item.location.y,
          lng: item.location.x,
        },
      })
    }

    return data
  }

  export const withLocation = async (requestQuery: Entity.RequestQueryWithLocation): Promise<Entity.ResponseWithLocation> => {
    const items: any = isRequestBounds(requestQuery.bounds) ? await Repository.withLocation(requestQuery) : []
    const total: any = await Repository.getTotalWithLocation()

    const result: Entity.ResponseWithLocation = {
      data: responseWithLocation(items),
      meta: {
        total: total.total,
      },
    }

    return result
  }

  export const suggestion = async (requestQuery: Entity.RequestQuerySuggestion): Promise<Entity.ResponseSuggestion> => {
    const items: any = await Repository.suggestion(requestQuery)

    const result: Entity.ResponseSuggestion = {
      data: items,
      meta: {
        total: items.length,
      },
    }

    return result
  }
}
