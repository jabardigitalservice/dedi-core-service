import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { getOriginalName, getUrl } from '../../helpers/cloudStorage'
import { convertToBoolean } from '../../helpers/constant'
import { metaPagination } from '../../helpers/paginate'
import lang from '../../lang'
import { Page as Entity } from './page_entity'
import { Page as Repository } from './page_repository'

export namespace Page {
  const response = (item: any): Entity.Response => ({
    id: item.id,
    title: item.title,
    link: item.link,
    is_active: convertToBoolean(item.is_active),
    order: item.order,
    image: {
      path: getUrl(item.image),
      source: item.image,
      original_name: getOriginalName(item.file_name),
    },
  })

  const responseFindAll = (items: any[]): Entity.Response[] => {
    const data: Entity.Response[] = []
    for (const item of items) {
      data.push(response(item))
    }

    return data
  }

  export const findAll = async (requestQuery: Entity.RequestQuery) => {
    const items: any = await Repository.findAll(requestQuery)

    const result: Entity.ResponseFindAll = {
      data: responseFindAll(items.data),
      meta: metaPagination(items.pagination),
    }

    return result
  }

  export const findById = async (id: string) => {
    const item: any = await Repository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    const result: Entity.ResponseFindById = {
      data: response(item),
      meta: {},
    }

    return result
  }

  export const store = async (requestBody: Entity.RequestBody, user: any) => {
    await Repository.createFile({
      source: requestBody.image,
      name: requestBody.image_original_name,
    })

    return Repository.store({
      created_by: user.identifier,
      title: requestBody.title,
      order: requestBody.order,
      link: requestBody.link,
      is_active: convertToBoolean(requestBody.is_active),
      image: requestBody.image,
    })
  }

  export const destroy = async (id: string) => {
    const item: any = await Repository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    return Repository.destroy(item.id)
  }

  export const update = async (requestBody: Entity.RequestBody, id: string) => {
    const item: any = await Repository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    await Repository.updateFile(
      {
        source: requestBody.image,
        name: requestBody.image_original_name,
      },
      item.file_id
    )

    return Repository.update(
      {
        title: requestBody.title,
        link: requestBody.link,
        order: requestBody.order,
        is_active: convertToBoolean(requestBody.is_active),
        image: requestBody.image,
      },
      item.id
    )
  }
}
