import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import { Request } from 'express'
import { HttpError } from '../../handler/exception'
import { checkError, uniqueRule } from '../../helpers/rules'
import lang from '../../lang'
import { Auth as Entity } from './auth_entity'
import { Auth as Repository } from './auth_repository'
import { createAccessToken, createRefreshToken, decodeToken } from '../../middleware/jwt'
import { sendMail } from '../../helpers/mail'
import config from '../../config'

export namespace Auth {
  export const signUp = async (requestBody: Entity.RequestBodySignUp) => {
    checkError(await uniqueRule({
      table: 'users',
      key: 'email',
      value: requestBody.email,
    }))

    const user: Entity.RequestBodySignUp = {
      name: requestBody.name,
      email: requestBody.email,
      password: Repository.passwordHash(requestBody.password),
      google_id: requestBody.google_id,
    }

    user.partner_id = requestBody.company ? await Repository.getPartnerId(requestBody) : null

    return Repository.signUp(user)
  }

  const generateJwtToken = (user: Entity.StructUser): Entity.ResponseJWT => {
    const identifier = user.id
    const access_token = createAccessToken({
      identifier,
      prtnr: !!user.partner_id,
      adm: !!user.is_admin,
    })
    const refresh_token = createRefreshToken({ identifier })
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

  const templateHtmlForgotEmail = (linkRedirect: string, aliasRedirect: string) => `
    <p>${lang.__('template.paragraph.forgot.password')}</p>
    <a href="${linkRedirect}">${aliasRedirect}</a>
    `

  export const signIn = async (requestBody: Entity.RequestBodySignIn) => {
    const user = await Repository.findByEmail(requestBody)
    if (!user) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.user.failed'))

    const match = await bcrypt.compare(requestBody.password, user.password)
    if (!match) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.password.failed', { field: 'email' }))

    if (!user.verified_at) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.verified.failed'))

    const responseJwt = generateJwtToken(user)

    Repository.createOauthToken({
      user_id: user.id,
      access_token: responseJwt.data.access_token,
      refresh_token: responseJwt.data.refresh_token,
      expired_in: responseJwt.data.expired_in,
    })

    return responseJwt
  }

  export const refreshToken = async (requestBody: Entity.RequestBodyRefreshToken) => {
    const user: Entity.StructUser = await Repository.findByRefreshToken(requestBody)
    if (!user) throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, lang.__('auth.refreshToken.failed'))

    const responseJwt = generateJwtToken(user)

    Repository.updateRefreshToken(
      requestBody.refresh_token,
      {
        user_id: user.id,
        access_token: responseJwt.data.access_token,
        refresh_token: responseJwt.data.refresh_token,
        expired_in: responseJwt.data.expired_in,
      },
    )

    return responseJwt
  }

  export const forgotPassword = async (requestBody: Entity.RequestBodyForgotPassword): Promise<Entity.ResponseForgotPassword> => {
    const user = await Repository.findByEmail(requestBody)
    if (!user) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.email.failed'))

    const token = createRefreshToken({
      identifier: user.id,
      target: 'password-verify',
    })

    const aliasRedirect = config.get('url.redirect.forgot.password')
    const linkRedirect = `${config.get('url.redirect.forgot.password')}?token=${token}`

    sendMail({
      to: user.email,
      subject: lang.__('subject.forgot.password'),
      html: templateHtmlForgotEmail(linkRedirect, aliasRedirect),
    })

    return { message: lang.__('auth.email.forgot.password.success', { email: user.email }) }
  }

  export const forgotPasswordVerify = async (requestQuery: Request): Promise<Entity.ResponseForgotPasswordVerify> => {
    const decodeJwt: any = requestQuery.user

    if (decodeJwt?.target !== 'password-verify') throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.rejected'))

    const user = await Repository.findByUserId(decodeJwt.identifier)
    if (!user) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.user.failed'))

    const access_token = createRefreshToken({
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

  export const resetPassword = async (requestQuery: Request, requestBody: Entity.RequestBodyResetPassword) => {
    const decodeJwt: any = requestQuery.user

    if (decodeJwt?.target !== 'reset-password') throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.rejected'))

    const passwordHash = Repository.passwordHash(requestBody.password)

    return Repository.updatePassword(decodeJwt.identifier, passwordHash)
  }

}
