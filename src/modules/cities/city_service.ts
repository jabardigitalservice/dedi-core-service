import { City as Entity } from './city_entity'
import { City as Repository } from './city_repository'

export namespace City {
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
    const items: any = await Repository.findAllWithLocation(requestQuery)
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
