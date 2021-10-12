import { Village as Entity } from './village_entity'
import { Village as Repository } from './village_repository'

export namespace Village {
  export const findAllWithLocation = async (): Promise<Entity.ResponseFindAllWithLocation[]> => {
    const items = await Repository.findAllWithLocation()

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
        images: JSON.parse(item.images)
      })
    }

    return data
  }
}
