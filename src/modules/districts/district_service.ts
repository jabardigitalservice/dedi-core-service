import { District as Entity } from './district_entity'
import { District as Repository } from './district_repository'

export namespace District {
  const pointRegexRule = (point: string) => {
    const pointRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/
    return pointRegex.test(point)
  }

  const isRequestBounds = (requestQuery: Entity.RequestQueryWithLocation) => requestQuery.bounds?.ne
    && requestQuery.bounds.sw
    && pointRegexRule(requestQuery.bounds.ne)
    && pointRegexRule(requestQuery.bounds.sw)

  const responseWithLocation = (items: any[]): Entity.WithLocation[] => {
    const data: Entity.WithLocation[] = []
    for (const item of items) {
      data.push({
        id: item.id,
        name: item.name,
        city: {
          id: item.cities_id,
          name: item.cities_name,
        },
        location: {
          lat: item.location.y,
          lng: item.location.x,
        },
      })
    }

    return data
  }

  export const withLocation = async (requestQuery: Entity.RequestQueryWithLocation): Promise<Entity.ResponseWithLocation> => {
    const items: any = isRequestBounds(requestQuery) ? await Repository.withLocation(requestQuery) : []
    const total: any = await Repository.getTotalWithLocation()

    const result: Entity.ResponseWithLocation = {
      data: responseWithLocation(items),
      meta: {
        total: total.total,
      },
    }

    return result
  }
}
