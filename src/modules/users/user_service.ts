import httpStatus from 'http-status'
import config from '../../config'
import { HttpError } from '../../handler/exception'
import { convertToBoolean, StatusPartner } from '../../helpers/constant'
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

  private getPartnerId = async (company: string): Promise<string> => {
    const partner = await this.userRepository.findByNamePartner(company)
    if (partner) {
      return partner.id
    }

    return this.userRepository.storePartner(company)
  }

  public store = async (request: UserEntity.RequestBody) => {
    await this.userRepository.createFile({
      source: request.avatar,
      name: request.avatar_original_name,
    })

    const payload = this.getRequestBody(request) as UserEntity.User
    payload.is_active = false
    payload.is_admin = false

    if (request.roles === config.get('role.0')) {
      payload.is_active = true
      payload.is_admin = true
      payload.password = passwordHash(request.password)
    }

    if (request.roles === config.get('role.1')) {
      payload.partner_id = await this.getPartnerId(request.company)
      payload.status_partner = StatusPartner.VERIFIED
    }

    return this.userRepository.store(payload)
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

    const payload = this.getRequestBody(request) as UserEntity.User

    // check if roles is partner and partners are changing
    if (request.roles === config.get('role.1') && item.partner_name !== request.company) {
      payload.partner_id = await this.getPartnerId(request.company)
    }

    return this.userRepository.update(payload, id)
  }

  public updateStatus = async (request: UserEntity.RequestBodyUpdateStatus, id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    return this.userRepository.updateStatus({ is_active: convertToBoolean(request.is_active) }, id)
  }
}
