import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Testimonial as Service } from './testimonial_service'

const router = express.Router()

router.get(
  '/v1/testimonials',
  (req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.OK).json({
      data: Service.findAll()
    })
  }
)

export default router
