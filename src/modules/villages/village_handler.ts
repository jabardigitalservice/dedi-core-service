import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Village as Service } from './village_service'

const router = express.Router()

router.get(
  '/v1/villages/list-with-location',
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.OK).json({
      data: await Service.findAllWithLocation()
    })
  })

export default router
