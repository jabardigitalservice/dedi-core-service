import httpStatus from 'http-status'
import config from '../../config'
import { HttpError } from '../../handler/exception'
import { getUrlCloudStorage } from '../../helpers/cloudStorage'
import { convertToBoolean } from '../../helpers/constant'
import { metaPagination } from '../../helpers/paginate'
import lang from '../../lang'
import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Repository } from './testimonial_repository'

export namespace Testimonial {
  const response = (item: any): Entity.Response => ({
    id: item.id,
    name: item.name,
    description: item.description,
    is_active: convertToBoolean(item.is_active),
    avatar: {
      path: getUrlCloudStorage(item.avatar),
      source: item.avatar,
      original_name: item.file_name,
    },
    type: item.type,
    partner: {
      id: item.partner_id,
      name: item.partner_name,
    },
    village: {
      id: item.village_id,
      name: item.village_name,
    },
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

  export const getRequestBody = (requestBody: Entity.RequestBody) => ({
    name: requestBody.name,
    description: requestBody.description,
    avatar: requestBody.avatar,
    type: requestBody.type,
    is_active: convertToBoolean(requestBody.is_active),
    partner_id: requestBody.type === config.get('role.1') ? requestBody.partner_id : null,
    village_id: requestBody.type === config.get('role.2') ? requestBody.village_id : null,
  })

  export const store = async (requestBody: Entity.RequestBody, user: any) => {
    Repository.createFile({
      source: requestBody.avatar,
      name: requestBody.avatar_original_name,
    })

    return Repository.store({
      created_by: user.identifier,
      ...getRequestBody(requestBody),
    })
  }

  export const update = async (requestBody: Entity.RequestBody, id: string) => {
    const item: any = await Repository.findById(id)
    if (!item) throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'testimonial', id }))

    Repository.updateFile({
      source: requestBody.avatar,
      name: requestBody.avatar_original_name,
    }, item.file_id)

    return Repository.update(getRequestBody(requestBody), id)
  }

  export const destroy = async (id: string) => {
    const item: any = await Repository.findById(id)
    if (!item) throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'testimonial', id }))

    return Repository.destroy(id)
  }

  export const findById = async (id: string) => {
    const item: any = await Repository.findById(id)
    if (!item) throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'testimonial', id }))

    const result: Entity.ResponseFindById = {
      data: response(item),
      meta: {},
    }

    return result
  }
}
