import httpStatus from 'http-status'
import config from '../../config'
import { HttpError } from '../../handler/exception'
import { getOriginalName, getUrl } from '../../helpers/cloudStorage'
import { convertToBoolean } from '../../helpers/constant'
import { metaPagination } from '../../helpers/paginate'
import { User } from '../../helpers/rbac'
import lang from '../../lang'
import { TestimonialEntity } from './testimonial_entity'
import { TestimonialRepository } from './testimonial_repository'

export class TestimonialService {
  private testimonialRepository: TestimonialRepository

  constructor(testimonialRepository: TestimonialRepository = new TestimonialRepository()) {
    this.testimonialRepository = testimonialRepository
  }

  private response = (item: any): TestimonialEntity.Response => ({
    id: item.id,
    name: item.name,
    description: item.description,
    is_active: convertToBoolean(item.is_active),
    avatar: {
      path: getUrl(item.avatar),
      source: item.avatar,
      original_name: getOriginalName(item.file_name),
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

  private responseFindAll = (items: any[]): TestimonialEntity.Response[] => {
    const data: TestimonialEntity.Response[] = []
    for (const item of items) {
      data.push(this.response(item))
    }

    return data
  }

  public findAll = async (
    request: TestimonialEntity.RequestQuery
  ): Promise<TestimonialEntity.ResponseFindAll> => {
    const items: any = await this.testimonialRepository.findAll(request)

    const result: TestimonialEntity.ResponseFindAll = {
      data: this.responseFindAll(items.data),
      meta: metaPagination(items.pagination),
    }

    return result
  }

  public getRequestBody = (request: TestimonialEntity.RequestBody) => ({
    name: request.name,
    description: request.description,
    avatar: request.avatar,
    type: request.type,
    is_active: convertToBoolean(request.is_active),
    partner_id: request.type === config.get('role.1') ? request.partner_id : null,
    village_id: request.type === config.get('role.2') ? request.village_id : null,
  })

  public store = async (request: TestimonialEntity.RequestBody, user: User) => {
    await this.testimonialRepository.createFile({
      source: request.avatar,
      name: request.avatar_original_name,
    })

    return this.testimonialRepository.store({
      ...this.getRequestBody(request),
      created_by: user.identifier,
    })
  }

  public update = async (request: TestimonialEntity.RequestBody, id: string) => {
    const item: any = await this.testimonialRepository.findById(id)
    if (!item)
      throw new HttpError(
        httpStatus.NOT_FOUND,
        lang.__('error.exists', { entity: 'testimonial', id })
      )

    await this.testimonialRepository.updateFile(
      {
        source: request.avatar,
        name: request.avatar_original_name,
      },
      item.file_id
    )

    return this.testimonialRepository.update(this.getRequestBody(request), id)
  }

  public destroy = async (id: string) => {
    const item: any = await this.testimonialRepository.findById(id)
    if (!item)
      throw new HttpError(
        httpStatus.NOT_FOUND,
        lang.__('error.exists', { entity: 'testimonial', id })
      )

    return this.testimonialRepository.destroy(id)
  }

  public findById = async (id: string) => {
    const item: any = await this.testimonialRepository.findById(id)
    if (!item)
      throw new HttpError(
        httpStatus.NOT_FOUND,
        lang.__('error.exists', { entity: 'testimonial', id })
      )

    const result: TestimonialEntity.ResponseFindById = {
      data: this.response(item),
      meta: {},
    }

    return result
  }
}
