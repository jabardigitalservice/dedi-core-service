import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import cache from '../../config/cache'
import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Service } from './testimonial_service'
import { Testimonial as Log } from './testimonial_log'

const router = express.Router()

router.get(
  '/v1/testimonials',
  cache(),
  Log.findAll(),
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseFindAll = await Service.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  },
)

router.get(
  '/v1/testimonialsUsingCursor',
  cache(),
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseFindAllUsingCursor = await Service.findAllUsingCursor(req.query)

    res.status(httpStatus.OK).json(result)
  },
)

export default router
