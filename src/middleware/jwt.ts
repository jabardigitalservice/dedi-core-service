import Jwt from 'express-jwt'
import { Request } from 'express'
import { JwtPayload, Secret, sign, SignOptions, decode } from 'jsonwebtoken'
import config from '../config'

interface VerifyToken {
  secretOrPublic: string
  algorithms: string
  isRequired?: boolean
}

interface CreateToken extends SignOptions {
  data: object
  secret: Secret
}

const verifyToken = (payload: VerifyToken) => {
  return Jwt({
    secret: payload.secretOrPublic,
    algorithms: [payload.algorithms],
    credentialsRequired: payload.isRequired ?? false,
    getToken: function fromHeaderOrQuerystring (req: Request) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1]
      } else if (req.query && req.query.token) {
        return req.query.token
      } else if (req.cookies && req.cookies.access_token) {
        return req.cookies.access_token
      }
      return null
    }
  })
}

const createToken = (payload: CreateToken) => {
  return sign(
    payload.data,
    payload.secret,
    {
      expiresIn: payload.expiresIn,
      algorithm: payload.algorithm
    }
  )
}

export const decodeToken = (token: string): JwtPayload => {
  const decodeJwt: any = decode(token)

  return decodeJwt
}

export const verifyAccessToken = verifyToken({
  secretOrPublic: config.get('jwt.public'),
  algorithms: config.get('jwt.algorithm')
})

export const createAccessToken = (data: object) => {
  return createToken({
    data,
    secret: config.get('jwt.secret'),
    expiresIn: Number(config.get('jwt.ttl')),
    algorithm: config.get('jwt.algorithm')
  })
}

export const createRefreshToken = (data: object) => {
  return createToken({
    data,
    secret: config.get('jwt.refresh.secret'),
    expiresIn: Number(config.get('jwt.refresh.ttl')),
    algorithm: config.get('jwt.refresh.algorithm')
  })
}
