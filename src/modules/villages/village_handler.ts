import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Village as Entity } from './village_entity'
import { Village as Service } from './village_service';

export namespace Village {
  export const withLocation = async (
    req: Request<never, never, never, Entity.RequestQueryWithLocation>,
    res: Response,
    next: NextFunction,
  ) => {
    const result: Entity.ResponseWithLocation = await Service.withLocation(req.query)

    res.status(httpStatus.OK).json(result)
  }

  export const listWithLocation = async (
    req: Request<never, never, never, Entity.RequestQueryListWithLocation>,
    res: Response,
    next: NextFunction
  ) => {
    const result: Entity.ResponseListWithLocation = await Service.listWithLocation(req.query)

    res.status(httpStatus.OK).json(result)
  }

  export const findById = async (
    req: Request<Entity.RequestParamFindById, never, never, never>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result: Entity.ResponseFindById = await Service.findById(req.params)

      res.status(httpStatus.OK).json(result)
    } catch (err) {
      next(err)
    }
  }
}
