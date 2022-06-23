import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { getOriginalName, getUrl } from '../../helpers/cloudStorage'
import { convertToBoolean } from '../../helpers/constant'
import { metaPagination } from '../../helpers/paginate'
import { User } from '../../helpers/rbac'
import lang from '../../lang'
import { PageEntity } from './page_entity'
import { PageRepository } from './page_repository'

export class PageService {
  private pageRepository: PageRepository

  constructor(pageRepository: PageRepository = new PageRepository()) {
    this.pageRepository = pageRepository
  }

  private response = (item: any): PageEntity.Response => ({
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

  private responseFindAll = (items: any[]): PageEntity.Response[] => {
    const data: PageEntity.Response[] = []
    for (const item of items) {
      data.push(this.response(item))
    }

    return data
  }

  public findAll = async (request: PageEntity.RequestQuery) => {
    const items: any = await this.pageRepository.findAll(request)

    const result: PageEntity.ResponseFindAll = {
      data: this.responseFindAll(items.data),
      meta: metaPagination(items.pagination),
    }

    return result
  }

  public findById = async (id: string) => {
    const item: any = await this.pageRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'Page', id }))

    const result: PageEntity.ResponseFindById = {
      data: this.response(item),
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
