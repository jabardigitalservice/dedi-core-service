import httpStatus from 'http-status'
import redis from '../../config/redis'
import { HttpError } from '../../handler/exception'
import lang from '../../lang'
import { Village as Entity } from './village_entity'
import { Village as Repository } from './village_repository'

export namespace Village {
  export const findAllWithLocation = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAllWithLocation> => {
    let data: Entity.FindAllWithLocation[]
    if (!await redis.get('find_all_with_location')) {
      const items = await Repository.findAllWithLocation()
      await redis.set('find_all_with_location', JSON.stringify(responseFindAllWithLocation(items)))
    }

    data = JSON.parse((await redis.get('find_all_with_location')))

    if (requestQuery.name) data = data.filter(i => i.name.toLowerCase() === requestQuery.name.toLowerCase())
    if (requestQuery.level) data = data.filter(i => i.level === Number(requestQuery.level))

    const result: Entity.ResponseFindAllWithLocation = {
      data: data,
      meta: {
        total: data.length
      }
    }

    return result
  }

  const responseFindAllWithLocation = (items: any[]): Entity.FindAllWithLocation[] => {
    const data: Entity.FindAllWithLocation[] = []
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

  export const findById = async ({ id }: Entity.RequestParamFindById): Promise<Entity.ResponseFindById> => {
    const item: any = await Repository.findById(id)

    if (!item) {
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Village', id }))
    }

    const result: Entity.ResponseFindById = {
      data: {
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
      },
      meta: {},
    };

    return result
  }
}
