import httpStatus from 'http-status'
import config from '../../config'
import { HttpError } from '../../handler/exception'
import { metaPagination } from '../../helpers/paginate'
import lang from '../../lang'
import { Page as Entity } from './page_entity'
import { Page as Repository } from './page_repository'

export namespace Page {
  const response = (item: any): Entity.Response => ({
    id: item.id,
    title: item.title,
    description: item.description,
    is_active: !!item.is_active,
    file: {
      name: item.files_name,
      path: item.files_path ? `${config.get('aws.s3.cloudfront')}/${item.files_path}` : null,
    },
  })

  const responseFindAll = (items: any[]): Entity.Response[] => {
    const data: Entity.Response[] = []
    for (const item of items) {
      data.push(response(item))
    }

    return data
  }

  export const findAll = async (requestQuery: Entity.RequestQueryPage) => {
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
}