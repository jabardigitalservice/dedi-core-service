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
    const items: any = await Repository.findAllWithLocation(requestQuery)

    const meta: any = Repository.metaFindAllWithLocation()
    const total: any = await meta.total
    const lastUpdate: any = await meta.lastUpdate

    const data = items.data || items
    const { pagination } = items

    const result: Entity.ResponseFindAllWithLocation = {
      data: responseFindAllWithLocation(data),
      meta: {
        current_page: pagination?.currentPage || 1,
        from: (Number(pagination?.currentPage) - 1) * Number(pagination?.perPage) + 1 || 0,
        last_page: pagination?.lastPage || 0,
        per_page: pagination?.perPage || 0,
        to: pagination?.to || 0,
        total: total.total,
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
