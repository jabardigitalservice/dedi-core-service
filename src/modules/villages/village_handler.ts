import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Village as Entity } from './village_entity'
import { Village as Service } from './village_service'

const router = express.Router()

router.get(
  '/v1/villages/list-with-location',
  async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    res.status(httpStatus.OK).json({
      data: await Service.findAllWithLocation(req.query)
    })
  })

export default router
