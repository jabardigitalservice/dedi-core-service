import httpStatus from 'http-status'
import { HttpError } from '../../handler/exception'
import { convertToBoolean } from '../../helpers/constant'
import { metaPagination } from '../../helpers/paginate'
import { passwordHash } from '../../helpers/passwordHash'
import { User } from '../../helpers/rbac'
import lang from '../../lang'
import { UserEntity } from './user_entity'
import { UserRepository } from './user_repository'
import { UserResponse } from './user_response'

export class UserService {
  private userRepository: UserRepository

  private userResponse: UserResponse

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository
    this.userResponse = new UserResponse()
  }

  public findAll = async (
    requestQuery: UserEntity.RequestQuery
  ): Promise<UserEntity.ResponseFindAll> => {
    const items: any = await this.userRepository.findAll(requestQuery)

    const result: UserEntity.ResponseFindAll = {
      data: this.userResponse.findAll(items.data),
      meta: metaPagination(items.pagination),
    }

    return result
  }

  public findById = async (id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    const result: UserEntity.ResponseFindById = {
      data: this.userResponse.findById(item),
      meta: {},
    }

    return result
  }

  public destroy = async (id: string, user: User) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    if (item.id === user.identifier)
      throw new HttpError(httpStatus.FORBIDDEN, lang.__('auth.grant.access'))

    return this.userRepository.destroy(item.id)
  }

  private getRequestBody = (request: UserEntity.RequestBody) => ({
    name: request.name,
    email: request.email,
    avatar: request.avatar,
  })

  public store = async (request: UserEntity.RequestBody) => {
    await this.userRepository.createFile({
      source: request.avatar,
      name: request.avatar_original_name,
    })

    return this.userRepository.store({
      ...this.getRequestBody(request),
      password: passwordHash(request.password),
      is_admin: true,
      is_active: true,
    })
  }

  public update = async (request: UserEntity.RequestBody, id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    await this.userRepository.updateFile(
      {
        source: request.avatar,
        name: request.avatar_original_name,
      },
      item.file_id
    )

    return this.userRepository.update(this.getRequestBody(request), id)
  }

  public updateStatus = async (request: UserEntity.RequestBodyUpdateStatus, id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    return this.userRepository.updateStatus({ is_active: convertToBoolean(request.is_active) }, id)
  }
}
