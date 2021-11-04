import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { validate } from '../../helpers/validator'
import { Auth as Entity } from './auth_entity'
import { Auth as Rules } from './auth_rules'
import { Auth as Service } from './auth_service'

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

export default router
