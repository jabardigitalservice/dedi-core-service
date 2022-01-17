import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { convertToBoolean } from '../../helpers/constant'
import { metaPagination } from '../../helpers/paginate'
import { getUrlS3 } from '../../helpers/s3'
import lang from '../../lang'
import { Page as Entity } from './page_entity'
import { Page as Repository } from './page_repository'

export namespace Page {
  const response = (item: any): Entity.Response => ({
    id: item.id,
    title: item.title,
    link: item.link,
    is_active: convertToBoolean(item.is_active),
    file: {
      path: getUrlS3(item.files_path),
      filename: item.files_path,
      original_name: item.files_name,
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
    if (!item) throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    const result: Entity.ResponseFindById = {
      data: response(item),
      meta: {},
    }

    return result
  }

  export const store = async (requestBody: Entity.RequestBody, user: any) => {
    const [fileId] = await Repository.createFile({
      name: requestBody.original_name,
      path: requestBody.filename,
    })

    return Repository.store({
      created_by: user.identifier,
      title: requestBody.title,
      link: requestBody.link,
      is_active: convertToBoolean(requestBody.is_active),
      file_id: fileId,
    })
  }

  export const destroy = async (id: string) => {
    const item: any = await Repository.findById(id)
    if (!item) throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    Repository.destroyFile(item.files_id)

    return Repository.destroy(item.id)
  }

  export const update = async (requestBody: Entity.RequestBody, id: string) => {
    const item: any = await Repository.findById(id)
    if (!item) throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    Repository.updateFile({
      name: requestBody.original_name,
      path: requestBody.filename,
    }, item.files_id)

    return Repository.update({
      title: requestBody.title,
      link: requestBody.link,
      is_active: convertToBoolean(requestBody.is_active),
    }, item.id)
  }
}
