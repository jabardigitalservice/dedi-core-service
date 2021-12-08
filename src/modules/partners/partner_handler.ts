import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import cache from '../../config/cache'
import { Partner as Entity } from './partner_entity'
import { Partner as Log } from './partner_log'
import { Partner as Service } from './partner_service'

const router = express.Router()

router.get(
  '/v1/partners',
  cache(),
  Log.findAll(),
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseFindAll = await Service.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  },
)

router.get(
  '/v1/partners/suggestion',
  async (
    req: Request<never, never, never, Entity.RequestQuerySuggestion>,
    res: Response,
    next: NextFunction,
  ) => {
    const result: Entity.ResponseSuggestion = await Service.search(req.query)

    res.status(httpStatus.OK).json(result)
  },
)

export default router
