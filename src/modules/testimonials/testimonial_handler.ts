import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Service } from './testimonial_service'

const router = express.Router()

router.get(
  '/v1/testimonials',
  (req: Request, res: Response, next: NextFunction) => {
    const result: Entity.ResponseFindAll = Service.findAll()

    res.status(httpStatus.OK).json(result)
  }
)

export default router
