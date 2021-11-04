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

    user.partner_id = requestBody.partner_id ? await Repository.getPartnerId(requestBody) : null

    return Repository.signUp(user)
  }

  export const signIn = async (requestBody: Entity.RequestBodySignIn) => {
    const user = await Repository.findByEmail(requestBody)
    if (!user) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.user.failed'))

    const match = await bcrypt.compare(requestBody.password, user.password)
    if (!match) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.password.failed'))

    if (!user.verified_at) throw new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.verified.failed'))

    return responseJwt(user)
  }

  const responseJwt = async (user: Entity.StructUser) => {
    delete user.password
    const jwt = generateToken(user)

    return {
      type: 'bearer',
      token: jwt,
      user: user
    }
  }

  const generateToken = (user: Entity.StructUser): string => {
    return jwt.sign(
      { uid: user.id, user },
      config.get('jwt.secret'),
      {
        expiresIn: Number(config.get('jwt.ttl')),
        algorithm: config.get('jwt.algorithm')
      }
    )
  }
}
