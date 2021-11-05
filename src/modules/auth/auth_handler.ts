import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import rateLimit from 'express-rate-limit'
import { validate } from '../../helpers/validator'
import { Auth as Entity } from './auth_entity'
import { Auth as Rules } from './auth_rules'
import { Auth as Service } from './auth_service'
import config from '../../config'
import { isNodeEnvProduction } from '../../helpers/constant'
import { Auth as Log } from './auth_log'
import jwt from '../../middleware/jwt'

const apiLimiterSignIn = rateLimit({
  windowMs: Number(config.get('api.limiter.time.signin', 300000)),
  max: Number(config.get('api.limiter.max.signin', 3))
});

const router = express.Router()

router.post(
  '/v1/auth/users/sign-up',
  validate(Rules.signUp, 'body'),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body: Entity.RequestBodySignUp = req.body
      await Service.signUp(body)
      res.status(httpStatus.CREATED).json({ message: 'CREATED' })
    } catch (error) {
      next(error)
    }
  })

router.post(
  '/v1/auth/users/sign-in',
  apiLimiterSignIn,
  validate(Rules.signIn, 'body'),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body: Entity.RequestBodySignIn = req.body
      const result: Entity.ResponseJWT = await Service.signIn(body)
      Log.signIn(body)
      if (body.remember) {
        res.cookie('access_token', result.data.access_token, {
          httpOnly: true,
          secure: isNodeEnvProduction(),
          expires: new Date(Date.now() + Number(config.get('jwt.ttl')))
        })
      }
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  })

router.post(
  '/v1/auth/users/refresh-token',
  jwt,
  validate(Rules.refreshToken, 'body'),
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body: Entity.RequestBodyRefreshToken = req.body
      const result: Entity.ResponseJWT = await Service.refreshToken(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  })

export default router
