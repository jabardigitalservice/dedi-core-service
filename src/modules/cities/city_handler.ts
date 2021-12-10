import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { City as Entity } from './city_entity'
import { City as Service } from './city_service';

export namespace City {
  export const withLocation = async (
    req: Request<never, never, never, Entity.RequestQueryWithLocation>,
    res: Response,
    next: NextFunction,
  ) => {
    const result: Entity.ResponseWithLocation = await Service.withLocation(req.query)

    res.status(httpStatus.OK).json(result)
  }
}
