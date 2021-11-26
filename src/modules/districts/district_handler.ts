import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { District as Entity } from './district_entity'
import { District as Service } from './district_service';

const router = express.Router()

router.get(
  '/v1/districts/with-location',
  async (req: Request<never, never, never, Entity.RequestQueryWithLocation>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseWithLocation = await Service.withLocation(req.query)

    res.status(httpStatus.OK).json(result)
  },
)

export default router
