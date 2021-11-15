import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import lang from '../../lang'
import { Village as Entity } from './village_entity'
import { Village as Repository } from './village_repository'

export namespace Village {

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
          lat: item.location.y,
          lng: item.location.x,
        },
        images: JSON.parse(item.images) || [],
      })
    }

    return data
  }

  export const findAllWithLocation = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAllWithLocation> => {
    const items = await Repository.findAllWithLocation(requestQuery)
    const lastUpdate = await Repository.getLastUpdate()

    const result: Entity.ResponseFindAllWithLocation = {
      data: responseFindAllWithLocation(items),
      meta: {
        total: items.length,
        last_update: lastUpdate?.updated_at || null,
      },
    }

    return result
  }

  export const findById = async ({ id }: Entity.RequestParamFindById): Promise<Entity.ResponseFindById> => {
    const item: any = await Repository.findById(id)

    if (!item) throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Village', id }))

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
