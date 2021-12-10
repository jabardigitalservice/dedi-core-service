import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { District as Entity } from './district_entity'
import { District as Service } from './district_service';

export namespace District {
  export const withLocation = async (
    req: Request<never, never, never, Entity.RequestQueryWithLocation>,
    res: Response,
    next: NextFunction,
  ) => {
    const result: Entity.ResponseWithLocation = await Service.withLocation(req.query)

    res.status(httpStatus.OK).json(result)
  }
}
