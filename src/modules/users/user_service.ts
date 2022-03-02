import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { convertToBoolean } from '../../helpers/constant'
import { getUrlGCS } from '../../helpers/gcs'
import { metaPagination } from '../../helpers/paginate'
import lang from '../../lang'
import { User as Entity } from './user_entity'
import { User as Repository } from './user_repository'

export namespace User {
  const response = (item: any): Entity.Response => ({
    id: item.id,
    name: item.name,
    email: item.email,
    avatar: {
      path: getUrlGCS(item.avatar),
      source: item.avatar,
      original_name: item.file_name,
    },
    is_active: convertToBoolean(item.is_active),
    created_at: item.created_at,
    updated_at: item.updated_at,
    last_login_at: item.last_login_at,
  })

  const responseFindAll = (items: any[]): Entity.Response[] => {
    const data: Entity.Response[] = []
    for (const item of items) {
      data.push(response(item))
    }

    return data
  }

  export const findAll = async (requestQuery: Entity.RequestQuery): Promise<Entity.ResponseFindAll> => {
    const items: any = await Repository.findAll(requestQuery)

    const result: Entity.ResponseFindAll = {
      data: responseFindAll(items.data),
      meta: metaPagination(items.pagination),
    }

    return result
  }

  export const findById = async (id: string) => {
    const item: any = await Repository.findById(id)
    if (!item) throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    const result: Entity.ResponseFindById = {
      data: response(item),
      meta: {},
    }

    return result
  }
}
