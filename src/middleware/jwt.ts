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

const getToken = (req: Request) => {
  if (req.headers?.authorization?.split(' ')?.[0] === config.get('jwt.type')) {
    return req.headers.authorization.split(' ')[1]
  }
  return null
}

const verifyToken = (payload: VerifyToken) =>
  Jwt({
    secret: payload.secretOrPublic,
    algorithms: [payload.algorithms],
    credentialsRequired: payload.isRequired ?? false,
    getToken,
  })

const createToken = (payload: CreateToken) =>
  sign(payload.data, payload.secret, {
    expiresIn: payload.expiresIn,
    algorithm: payload.algorithm,
  })

export const decodeToken = (token: string): JwtPayload => {
  const decodeJwt: any = decode(token)

  return decodeJwt
}

export const verifyAccessToken = verifyToken({
  secretOrPublic: config.get('jwt.public'),
  algorithms: config.get('jwt.algorithm'),
})

export const verifyRefreshToken = verifyToken({
  secretOrPublic: config.get('jwt.refresh.public'),
  algorithms: config.get('jwt.refresh.algorithm'),
})

export const createAccessToken = (data: object) =>
  createToken({
    data,
    secret: config.get('jwt.secret'),
    expiresIn: Number(config.get('jwt.ttl')),
    algorithm: config.get('jwt.algorithm'),
  })

export const createRefreshToken = (data: object) =>
  createToken({
    data,
    secret: config.get('jwt.refresh.secret'),
    expiresIn: Number(config.get('jwt.refresh.ttl')),
    algorithm: config.get('jwt.refresh.algorithm'),
  })
