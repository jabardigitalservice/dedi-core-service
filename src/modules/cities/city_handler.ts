import express, { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { City as Entity } from './city_entity'
import { City as Service } from './city_service';

const router = express.Router()

router.get(
  '/v1/cities/with-location',
  async (req: Request<never, never, never, Entity.RequestQueryWithLocation>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseWithLocation = await Service.withLocation(req.query)

    res.status(httpStatus.OK).json(result)
  },
)

export default router
