import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import lang from '../../lang'
import { Village as Entity } from './village_entity'
import { Village as Repository } from './village_repository'

export namespace Village {
  export const findAllWithLocation = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAllWithLocation> => {
    const items = await Repository.findAllWithLocation(requestQuery)

    const result: Entity.ResponseFindAllWithLocation = {
      data: responseFindAllWithLocation(items),
      meta: {
        total: items.length
      }
    }

    return result
  }

  export const search = async (requestQuery: Entity.RequestQuerySearch): Promise<Entity.ResponseSearch> => {
    const items = requestQuery.q && requestQuery.q.length >= 3 ? await Repository.search(requestQuery) : []

    const data: Entity.Search[] = []
    for (const item of items) {
      data.push({
        name: item.name,
      })
    }

    const result: Entity.ResponseSearch = {
      data: data,
      meta: {
        total: items.length
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
