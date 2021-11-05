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

const apiLimiterSignIn = rateLimit({
  windowMs: Number(config.get('api.limiter.time.signin', 300000)),
  max: Number(config.get('api.limiter.max.signin', 3))
});

const router = express.Router()

router.post(
  '/v1/auth/users/sign-up',
  validate(Rules.signUp, 'body'),
  async (
    req: Request<never, Entity.RequestBodySignUp, never, never>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await Service.signUp(req.body)
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
    req: Request<never, Entity.RequestBodySignIn, never, never>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result: Entity.ResponseJWT = await Service.signIn(req.body)
      Log.signIn(req.body)
      res.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: isNodeEnvProduction()
      }).status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  })

export default router
