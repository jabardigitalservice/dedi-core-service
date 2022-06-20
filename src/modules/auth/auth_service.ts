import httpStatus from 'http-status'
import { compare as Compare } from 'bcryptjs'
import { Request } from 'express'
import { verify } from 'jsonwebtoken'
import { HttpError } from '../../handler/exception'
import lang from '../../lang'
import { AuthEntity } from './auth_entity'
import { AuthRepository } from './auth_repository'
import {
  createAccessToken as CreateAccessToken,
  createRefreshToken as CreateRefreshToken,
  decodeToken,
} from '../../middleware/jwt'
import { sendMail as SendMail } from '../../helpers/mail'
import config from '../../config'
import { getRole } from '../../helpers/rbac'
import { convertToBoolean } from '../../helpers/constant'
import { passwordHash as PasswordHash } from '../../helpers/passwordHash'
import { getUrl } from '../../helpers/cloudStorage'

export class AuthService {
  private authRepository: AuthRepository

  private passwordHash: typeof PasswordHash

  private createAccessToken: typeof CreateAccessToken

  private createRefreshToken: typeof CreateRefreshToken

  private compare: typeof Compare

  private sendMail: typeof SendMail

  constructor(
    authRepository: AuthRepository = new AuthRepository(),
    passwordHash: typeof PasswordHash = PasswordHash,
    createAccessToken: typeof CreateAccessToken = CreateAccessToken,
    createRefreshToken: typeof CreateRefreshToken = CreateRefreshToken,
    compare: typeof Compare = Compare,
    sendMail: typeof SendMail = SendMail
  ) {
    this.passwordHash = passwordHash
    this.authRepository = authRepository
    this.createAccessToken = createAccessToken
    this.createRefreshToken = createRefreshToken
    this.compare = compare
    this.sendMail = sendMail
  }

  public signUp = async (request: AuthEntity.RequestBodySignUp) => {
    const user: AuthEntity.RequestBodySignUp = {
      name: request.name,
      email: request.email,
      password: this.passwordHash(request.password),
      google_id: request.google_id,
    }

    user.partner_id = request.company ? await this.authRepository.getPartnerId(request) : null

    return this.authRepository.signUp(user)
  }

  private generateJwtToken = (user: AuthEntity.StructUser): AuthEntity.ResponseJWT => {
    const identifier = user.id
    const access_token = this.createAccessToken({
      identifier,
      prtnr: !!user.partner_id,
      adm: convertToBoolean(user.is_admin),
    })
    const refresh_token = this.createRefreshToken({ identifier })
    const decodeJwt = decodeToken(access_token)

    return {
      data: {
        type: config.get('jwt.type'),
        access_token,
        refresh_token,
        expired_in: decodeJwt.exp,
      },
    }
  }

  private templateHtmlForgotEmail = (linkRedirect: string, aliasRedirect: string) => `
    <p>${lang.__('template.paragraph.forgot.password')}</p>
    <a href="${linkRedirect}">${aliasRedirect}</a>
    `

  public signIn = async (request: AuthEntity.RequestBodySignIn) => {
    const user = await this.authRepository.findByEmail(request)
    if (!user) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.signin.failed'))

    const match = await this.compare(request.password, user.password)
    if (!match) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.signin.failed'))

    if (!user.verified_at)
      throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.verified.failed'))

    if (!user.is_active) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.active.failed'))

    const responseJwt = this.generateJwtToken(user)

    await this.authRepository.updateLastLoginAt(user.id)

    await this.authRepository.createOauthToken({
      user_id: user.id,
      access_token: responseJwt.data.access_token,
      refresh_token: responseJwt.data.refresh_token,
      expired_in: responseJwt.data.expired_in,
    })

    return responseJwt
  }

  private throwRefreshTokenFailed = async (request: AuthEntity.RequestBodyRefreshToken) => {
    await this.authRepository.deleteOauthbyRefreshToken(request)
    throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, lang.__('auth.refreshToken.failed'))
  }

  private verifyRefreshToken = async (request: AuthEntity.RequestBodyRefreshToken) => {
    try {
      verify(request.refresh_token, config.get('jwt.refresh.public'), {
        algorithms: config.get('jwt.refresh.algorithm'),
      })
    } catch (err) {
      await this.throwRefreshTokenFailed(request)
    }
  }

  public refreshToken = async (request: AuthEntity.RequestBodyRefreshToken) => {
    const user: any = await this.authRepository.findByRefreshToken(request)
    if (!user)
      throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, lang.__('auth.refreshToken.failed'))

    if (!user.is_active) await this.throwRefreshTokenFailed(request)

    await this.verifyRefreshToken(request)

    const responseJwt = this.generateJwtToken(user)

    await this.authRepository.updateRefreshToken(request.refresh_token, {
      user_id: user.id,
      access_token: responseJwt.data.access_token,
      refresh_token: responseJwt.data.refresh_token,
      expired_in: responseJwt.data.expired_in,
    })

    return responseJwt
  }

  public signOut = async (request: AuthEntity.RequestBodyRefreshToken) => {
    const user: any = await this.authRepository.findByRefreshToken(request)
    if (!user)
      throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, lang.__('auth.refreshToken.failed'))

    return this.authRepository.deleteOauthbyRefreshToken(request)
  }

  public me = async (req: Request) => {
    const decodeJwt: any = req.user
    const user: any = await this.authRepository.findByUserId(decodeJwt.identifier)
    if (!user) throw new HttpError(httpStatus.NOT_FOUND, lang.__('auth.user.not.found'))

    const { name, email, avatar } = user
    const role = getRole(req.user)

    const result: AuthEntity.ResponseMe = {
      data: {
        name,
        email,
        avatar: getUrl(avatar),
        role,
      },
      meta: {},
    }

    return result
  }

  public forgotPassword = async (
    request: AuthEntity.RequestBodyForgotPassword
  ): Promise<AuthEntity.ResponseForgotPassword> => {
    const user: any = await this.authRepository.findByEmail(request)
    if (!user) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.email.failed'))

    const token = this.createRefreshToken({
      identifier: user.id,
      target: 'password-verify',
    })

    const aliasRedirect = config.get('url.redirect.forgot.password')
    const linkRedirect = `${aliasRedirect}?token=${token}`

    this.sendMail({
      to: user.email,
      subject: lang.__('subject.forgot.password'),
      html: this.templateHtmlForgotEmail(linkRedirect, aliasRedirect),
    })

    return { message: lang.__('auth.email.forgot.password.success', { email: user.email }) }
  }

  public forgotPasswordVerify = async (
    request: Request
  ): Promise<AuthEntity.ResponseForgotPasswordVerify> => {
    const decodeJwt: any = request.user

    if (decodeJwt?.target !== 'password-verify')
      throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.rejected'))

    const user = await this.authRepository.findByUserId(decodeJwt.identifier)
    if (!user) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.user.failed'))

    const access_token = this.createRefreshToken({
      identifier: user.id,
      target: 'reset-password',
    })

    return {
      data: {
        access_token,
        email: user.email,
      },
    }
  }

  public resetPassword = async (
    request: Request,
    requestBody: AuthEntity.RequestBodyResetPassword
  ) => {
    const decodeJwt: any = request.user

    if (decodeJwt?.target !== 'reset-password')
      throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.rejected'))

    return this.authRepository.updatePassword(
      decodeJwt.identifier,
      this.passwordHash(requestBody.password)
    )
  }
}
