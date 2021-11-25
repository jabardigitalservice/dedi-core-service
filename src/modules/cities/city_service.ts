import { City as Entity } from './city_entity'
import { City as Repository } from './city_repository'

export namespace City {
  const pointRegexRule = (point: string) => {
    const pointRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/
    return pointRegex.test(point)
  }

  const isRequestBounds = (requestQuery: Entity.RequestQuery) => requestQuery?.bounds?.ne
    && requestQuery?.bounds?.sw
    && pointRegexRule(requestQuery.bounds.ne)
    && pointRegexRule(requestQuery.bounds.sw)

  const responseFindAllWithLocation = (items: any[]): Entity.FindAllWithLocation[] => {
    const data: Entity.FindAllWithLocation[] = []
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

  export const findAllWithLocation = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAllWithLocation> => {
    const items: any = isRequestBounds(requestQuery) ? await Repository.findAllWithLocation(requestQuery) : []
    const total: any = await Repository.getTotalFindAllWithLocation()

    const result: Entity.ResponseFindAllWithLocation = {
      data: responseFindAllWithLocation(items),
      meta: {
        total: total.total,
      },
    }

    return result
  }
}
