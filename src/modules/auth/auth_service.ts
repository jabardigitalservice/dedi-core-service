import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import { HttpError } from '../../handler/exception'
import { checkError, uniqueRule } from '../../helpers/rules'
import lang from '../../lang'
import { Auth as Entity } from './auth_entity'
import { Auth as Repository } from './auth_repository'
import jwt from 'jsonwebtoken'
import config from '../../config'

export namespace Auth {
  export const signUp = async (requestBody: Entity.RequestBodySignUp) => {
    checkError(await uniqueRule({
      table: 'users',
      key: 'email',
      value: requestBody.email
    }))

    const user: Entity.RequestBodySignUp = {
      name: requestBody.name,
      email: requestBody.email,
      password: Repository.passwordHash(requestBody.password),
      google_id: requestBody.google_id
    }

    user.partner_id = requestBody.company ? await Repository.getPartnerId(requestBody) : null

    return Repository.signUp(user)
  }

  export const signIn = async (requestBody: Entity.RequestBodySignIn) => {
    const user = await Repository.findByEmail(requestBody)
    if (!user) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.user.failed'))

    const match = await bcrypt.compare(requestBody.password, user.password)
    if (!match) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.password.failed'))

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

    Repository.updateRefreshToken(requestBody.refresh_token,
      {
        user_id: user.id,
        access_token: responseJwt.data.access_token,
        refresh_token: responseJwt.data.refresh_token,
        expired_in: responseJwt.data.expired_in,
      })

    return responseJwt
  }

  const generateJwtToken = (user: Entity.StructUser): Entity.ResponseJWT => {
    const access_token = generateAccessToken(user)
    const refresh_token = generateRefreshToken(user)
    const decodeJwt: any = jwt.decode(access_token)
    const exp: number = decodeJwt.exp

    const data = {
      type: 'bearer',
      access_token,
      refresh_token,
      expired_in: exp,
    }

    return { data }
  }

  const generateAccessToken = (user: Entity.StructUser): string => {
    const jwtUser = {
      prtnr: !!user.partner_id,
      adm: !!user.is_admin
    }

    return jwt.sign(
      { identifier: user.id, ...jwtUser },
      config.get('jwt.secret'),
      {
        expiresIn: Number(config.get('jwt.ttl')),
        algorithm: config.get('jwt.algorithm')
      }
    )
  }

  const generateRefreshToken = (user: Entity.StructUser): string => {
    return jwt.sign(
      { identifier: user.id },
      config.get('jwt.refresh.secret'),
      {
        expiresIn: Number(config.get('jwt.refresh.ttl')),
        algorithm: config.get('jwt.refresh.algorithm')
      }
    )
  }
}
