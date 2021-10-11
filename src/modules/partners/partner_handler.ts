import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { validate } from '../../helpers/validator'
import { Partner as Entity } from './partner_entity'
import { Partner as Rules } from './partner_rules'
import { Partner as Service } from './partner_service'

const router = express.Router()

router.get(
  '/v1/partners',
  validate(Rules.findAll, 'query'),
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    const partners = await Service.findAll(req.query)
    res.status(httpStatus.OK).json(partners)
  })

export default router
