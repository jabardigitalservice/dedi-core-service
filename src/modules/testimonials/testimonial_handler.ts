import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Service } from './testimonial_service'

const router = express.Router()

router.get(
  '/v1/testimonials',
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseFindAll = await Service.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  }
)

export default router
