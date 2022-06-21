import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { getOriginalName, getUrl } from '../../helpers/cloudStorage'
import { convertToBoolean } from '../../helpers/constant'
import { metaPagination as MetaPagination } from '../../helpers/paginate'
import { passwordHash } from '../../helpers/passwordHash'
import { getRole } from '../../helpers/rbac'
import lang from '../../lang'
import { UserEntity } from './user_entity'
import { UserRepository } from './user_repository'

export class UserService {
  private userRepository: UserRepository

  private metaPagination: typeof MetaPagination

  constructor(
    userRepository: UserRepository = new UserRepository(),
    metaPagination: typeof MetaPagination = MetaPagination
  ) {
    this.userRepository = userRepository
    this.metaPagination = metaPagination
  }

  private response = (item: any): UserEntity.Response => ({
    id: item.id,
    name: item.name,
    email: item.email,
    role: getRole({ prtnr: item.partner_id, adm: item.is_admin }),
    avatar: {
      path: getUrl(item.avatar),
      source: item.avatar,
      original_name: getOriginalName(item.file_name),
    },
    is_active: convertToBoolean(item.is_active),
    created_at: item.created_at,
    updated_at: item.updated_at,
    last_login_at: item.last_login_at,
  })

  private responseFindAll = (items: any[]): UserEntity.Response[] => {
    const data: UserEntity.Response[] = []
    for (const item of items) {
      data.push(this.response(item))
    }

    return data
  }

  public findAll = async (
    requestQuery: UserEntity.RequestQuery
  ): Promise<UserEntity.ResponseFindAll> => {
    const items: any = await this.userRepository.findAll(requestQuery)

    const result: UserEntity.ResponseFindAll = {
      data: this.responseFindAll(items.data),
      meta: this.metaPagination(items.pagination),
    }

    return result
  }

  public findById = async (id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    const result: UserEntity.ResponseFindById = {
      data: this.response(item),
      meta: {},
    }

    return result
  }

  public destroy = async (id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    return this.userRepository.destroy(item.id)
  }

  private getRequestBody = (requestBody: UserEntity.RequestBody) => ({
    name: requestBody.name,
    email: requestBody.email,
    avatar: requestBody.avatar,
  })

  public store = async (requestBody: UserEntity.RequestBody) => {
    await this.userRepository.createFile({
      source: requestBody.avatar,
      name: requestBody.avatar_original_name,
    })

    return this.userRepository.store({
      ...this.getRequestBody(requestBody),
      password: passwordHash(requestBody.password),
      is_admin: true,
      is_active: true,
    })
  }

  public update = async (requestBody: UserEntity.RequestBody, id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    await this.userRepository.updateFile(
      {
        source: requestBody.avatar,
        name: requestBody.avatar_original_name,
      },
      item.file_id
    )

    return this.userRepository.update(this.getRequestBody(requestBody), id)
  }

  public updateStatus = async (requestBody: UserEntity.RequestBodyUpdateStatus, id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    return this.userRepository.updateStatus(
      { is_active: convertToBoolean(requestBody.is_active) },
      id
    )
  }
}
