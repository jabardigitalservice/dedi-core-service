import redis from '../../config/redis'
import { Village as Entity } from './village_entity'
import { Village as Repository } from './village_repository'

export namespace Village {
  export const findAllWithLocation = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAllWithLocation[]> => {
    let data: Entity.ResponseFindAllWithLocation[]
    if (!await redis.get('find_all_with_location')) {
      const items = await Repository.findAllWithLocation()
      await redis.set('find_all_with_location', JSON.stringify(responseFindAllWithLocation(items)))
    }

    data = JSON.parse((await redis.get('find_all_with_location')))

    if (requestQuery.name) data = data.filter(i => i.name.toLowerCase() === requestQuery.name.toLowerCase())
    if (requestQuery.level) data = data.filter(i => i.level === Number(requestQuery.level))

    return data
  }

  const responseFindAllWithLocation = (items: any[]): Entity.ResponseFindAllWithLocation[] => {
    const data: Entity.ResponseFindAllWithLocation[] = []
    for (const item of items) {
      data.push({
        id: item.id,
        name: item.villages_name,
        level: item.level,
        city: {
          id: item.cities_id,
          name: item.cities_name,
        },
        category: {
          id: item.categories_id,
          name: item.categories_name,
        },
        location: {
          lat: item.location.x,
          lng: item.location.y,
        },
        images: JSON.parse(item.images) || []
      })
    }

    return data
  }
}
