import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { metaPagination } from '../../helpers/paginate'
import lang from '../../lang'
import { Village as Entity } from './village_entity'
import { Village as Repository } from './village_repository'

export namespace Village {
  const responseWithLocation = (items: any[]): Entity.WithLocation[] => {
    const data: Entity.WithLocation[] = []
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
  const pointRegexRule = (point: string) => {
    const pointRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/
    return pointRegex.test(point)
  }

  const isRequestBounds = (requestQuery: Entity.RequestQueryWithLocation) => requestQuery.bounds?.ne
    && requestQuery.bounds.sw
    && pointRegexRule(requestQuery.bounds.ne)
    && pointRegexRule(requestQuery.bounds.sw)

  export const withLocation = async (requestQuery: Entity.RequestQueryWithLocation): Promise<Entity.ResponseWithLocation> => {
    const items: any = isRequestBounds(requestQuery) ? await Repository.withLocation(requestQuery) : []

    const meta: any = Repository.metaWithLocation()
    const total: any = await meta.total
    const lastUpdate: any = await meta.lastUpdate

    const result: Entity.ResponseWithLocation = {
      data: responseWithLocation(items),
      meta: {
        total: total.total,
        last_update: lastUpdate.updated_at,
      },
    }

    return result
  }

  export const listWithLocation = async (requestQuery: Entity.RequestQueryListWithLocation): Promise<Entity.ResponseListWithLocation> => {
    const items: any = await Repository.listWithLocation(requestQuery)

    const result: Entity.ResponseListWithLocation = {
      data: responseWithLocation(items.data),
      meta: metaPagination(items.pagination),
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
