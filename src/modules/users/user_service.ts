import httpStatus from 'http-status'
import config from '../../config'
import { HttpError } from '../../handler/exception'
import { convertToBoolean, StatusPartner } from '../../helpers/constant'
import { sendMail as SendMail } from '../../helpers/mail'
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

    const is_active = convertToBoolean(request.is_active)

    const payload = <UserEntity.RequestBodyUpdateStatus>{
      is_active,
    }

    const isStatusActiveInactive = [StatusPartner.ACTIVE, StatusPartner.INACTIVE].includes(
      item.status_partner
    )

    const status_partner = is_active ? StatusPartner.ACTIVE : StatusPartner.INACTIVE

    if (isStatusActiveInactive) payload.status_partner = status_partner

    return this.userRepository.updateStatus(payload, id)
  }

  public verify = async (request: UserEntity.RequestBodyVerify, id: string) => {
    const item: any = await this.userRepository.findById(id)
    if (!item)
      throw new HttpError(httpStatus.NOT_FOUND, lang.__('error.exists', { entity: 'user', id }))

    if (item.status_partner !== StatusPartner.WAITING)
      throw new HttpError(httpStatus.BAD_REQUEST, lang.__('error.users.partner.verified'))

    const is_verify = convertToBoolean(request.is_verify)

    const payload = <UserEntity.Verify>{
      is_active: true,
    }

    payload.status_partner = is_verify ? StatusPartner.ACTIVE : StatusPartner.REJECTED

    if (!is_verify) {
      payload.notes = request.notes
      payload.is_active = false
    }

    const html = is_verify
      ? this.templateEmailHtmlAccepted()
      : this.templateEmailHtmlRejected(request.notes)

    this.sendEmailVerify(is_verify, item.email, html)

    return this.userRepository.verify(payload, id)
  }

  private templateEmailHtmlAccepted = () => ``

  private templateEmailHtmlRejected = (notes: string) => ``

  private sendEmailVerify = async (is_verify: boolean, email: string, html: string) => {
    const subject = is_verify
      ? lang.__('subject.verify.subject.accepted')
      : lang.__('subject.verify.subject.rejected')

    this.sendMail({
      to: email,
      subject,
      html,
    })
  }
}
