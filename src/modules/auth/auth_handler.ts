import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import rateLimit from 'express-rate-limit'
import { validate } from '../../helpers/validator'
import { Auth as Entity } from './auth_entity'
import { Auth as Rules } from './auth_rules'
import { Auth as Service } from './auth_service'
import config from '../../config'
import { Auth as Log } from './auth_log'
import { verifyAccessToken } from '../../middleware/jwt'

const apiLimiterSignIn = rateLimit({
  windowMs: Number(config.get('api.limiter.time.signin', 300000)), // Default time signin 5 minutes
  max: Number(config.get('api.limiter.max.signin', 3)),
});

const router = express.Router()

router.post(
  '/v1/auth/users/sign-up',
  validate(Rules.signUp, 'body'),
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { body } = req
      await Service.signUp(body)
      res.status(httpStatus.CREATED).json({ message: 'CREATED' })
    } catch (error) {
      next(error)
    }
  },
)

router.post(
  '/v1/auth/users/sign-in',
  apiLimiterSignIn,
  validate(Rules.signIn, 'body'),
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { body } = req
      const result: Entity.ResponseJWT = await Service.signIn(body)
      Log.signIn(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  },
)

router.post(
  '/v1/auth/users/refresh-token',
  verifyAccessToken,
  validate(Rules.refreshToken, 'body'),
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { body } = req
      const result: Entity.ResponseJWT = await Service.refreshToken(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  },
)

router.post(
  '/v1/auth/users/forgot-password',
  validate(Rules.forgotPassword, 'body'),
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { body } = req
      const result: Entity.ResponseForgotPassword = await Service.forgotPassword(body)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  },
)

router.post(
  '/v1/auth/users/forgot-password/verify',
  verifyAccessToken,
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result: Entity.ResponseForgotPasswordVerify = await Service.forgotPasswordVerify(req)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  },
)

router.post(
  '/v1/auth/users/reset-password',
  verifyAccessToken,
  validate(Rules.resetPassword, 'body'),
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { body } = req
      await Service.resetPassword(req, body)
      res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      next(error)
    }
  },
)

export default router
