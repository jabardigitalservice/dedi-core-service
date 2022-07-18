import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { convertToBoolean } from '../../helpers/constant'
import { metaPagination } from '../../helpers/paginate'
import { User } from '../../helpers/rbac'
import lang from '../../lang'
import { PageEntity } from './page_entity'
import { PageRepository } from './page_repository'
import { PageResponse } from './page_response'

export class PageService {
  private pageRepository: PageRepository

  private pageResponse: PageResponse

  constructor(pageRepository: PageRepository = new PageRepository()) {
    this.pageRepository = pageRepository
    this.pageResponse = new PageResponse()
  }

  public findAll = async (request: PageEntity.RequestQuery) => {
    const items: any = await this.pageRepository.findAll(request)

    const result: PageEntity.ResponseFindAll = {
      data: this.pageResponse.findAll(items.data),
      meta: metaPagination(items.pagination),
    }

    return result
  }

  public findById = async (id: string) => {
    const item: any = await this.pageRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    const result: PageEntity.ResponseFindById = {
      data: this.pageResponse.findById(item),
      meta: {},
    }

    return result
  }

  public store = async (request: PageEntity.RequestBody, user: User) => {
    await this.pageRepository.createFile({
      source: request.image,
      name: request.image_original_name,
    })

    return this.pageRepository.store({
      created_by: user.identifier,
      title: request.title,
      order: request.order,
      link: request.link,
      is_active: convertToBoolean(request.is_active),
      image: request.image,
    })
  }

  public destroy = async (id: string) => {
    const item: any = await this.pageRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    return this.pageRepository.destroy(item.id)
  }

  public update = async (request: PageEntity.RequestBody, id: string) => {
    const item: any = await this.pageRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    await this.pageRepository.updateFile(
      {
        source: request.image,
        name: request.image_original_name,
      },
      item.file_id
    )

    return this.pageRepository.update(
      {
        title: request.title,
        link: request.link,
        order: request.order,
        is_active: convertToBoolean(request.is_active),
        image: request.image,
      },
      item.id
    )
  }
}
