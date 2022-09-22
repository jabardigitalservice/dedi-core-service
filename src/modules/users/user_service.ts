import httpStatus from 'http-status'
import config from '../../config'
import { HttpError } from '../../handler/exception'
import { convertToBoolean, UserStatus } from '../../helpers/constant'
import { contextDefault, Payload, sendMail as SendMail } from '../../helpers/mail'
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

  private sendMail: typeof SendMail

  constructor(
    userRepository: UserRepository = new UserRepository(),
    sendMail: typeof SendMail = SendMail
  ) {
    this.userRepository = userRepository
    this.userResponse = new UserResponse()
    this.sendMail = sendMail
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

  private setStoreAdmin = (payload: UserEntity.User, request: UserEntity.RequestBody) => {
    payload.is_active = true
    payload.is_admin = true
    payload.password = passwordHash(request.password)

    return payload
  }

  private setStorePartner = async (payload: UserEntity.User, request: UserEntity.RequestBody) => {
    payload.partner_id = await this.userRepository.storePartner(request.company)
    payload.status = UserStatus.VERIFIED

    return payload
  }

  private getStorePayload = async (request: UserEntity.RequestBody) => {
    let payload = this.getRequestBody(request) as UserEntity.User
    payload.is_active = false
    payload.is_admin = false

    if (request.roles === config.get('role.0')) {
      payload = this.setStoreAdmin(payload, request)
    }

    if (request.roles === config.get('role.1')) {
      payload = await this.setStorePartner(payload, request)
    }

    return payload
  }

  private sendEmailInvitationPartner = (email: string, name: string) => {
    this.sendMail({
      to: email,
      subject: lang.__('subject.invitation.partner'),
      template: 'invitation_partner',
      context: {
        name,
        ...contextDefault,
      },
    })
  }

  public store = async (request: UserEntity.RequestBody) => {
    await this.userRepository.createFile({
      source: request.avatar,
      name: request.avatar_original_name,
    })

    const payload = await this.getStorePayload(request)

    if (request.roles === config.get('role.1')) {
      this.sendEmailInvitationPartner(payload.email, payload.name)
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

    return this.userRepository.update(payload, id)
  }

  public updateStatus = async (request: UserEntity.RequestBodyUpdateStatus, id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    const is_active = convertToBoolean(request.is_active)

    const payload = <UserEntity.RequestBodyUpdateStatus>{
      is_active,
    }

    const isStatusActiveInactive = [UserStatus.ACTIVE, UserStatus.INACTIVE].includes(item.status)

    const status = is_active ? UserStatus.ACTIVE : UserStatus.INACTIVE

    if (isStatusActiveInactive) payload.status = status

    return this.userRepository.updateStatus(payload, id)
  }

  public verify = async (request: UserEntity.RequestBodyVerify, id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    if (item.status !== UserStatus.WAITING)
      throw new HttpError(httpStatus.BAD_REQUEST, lang.__('error.users.partner.verified'))

    const is_verify = convertToBoolean(request.is_verify)
    const payload = <UserEntity.Verify>{
      is_active: true,
      status: UserStatus.ACTIVE,
    }

    if (!is_verify) {
      payload.notes = request.notes
      payload.is_active = false
      payload.status = UserStatus.REJECTED
    }

    this.sendEmailVerify(item.email, is_verify, request.notes, item.name)

    return this.userRepository.verify(payload, id)
  }

  private sendEmailVerify = (email: string, is_verify: boolean, notes: string, name: string) => {
    const payload = <Payload>{
      to: email,
      template: 'verify_rejected_partner',
      subject: lang.__('subject.verify.rejected'),
      context: {
        notes,
        name,
        ...contextDefault,
      },
    }

    if (is_verify) {
      payload.template = 'verify_accepted_partner'
      payload.subject = lang.__('subject.verify.accepted')
    }

    this.sendMail(payload)
  }
}
