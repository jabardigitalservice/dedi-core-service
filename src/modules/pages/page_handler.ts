import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Page as Entity } from './page_entity'
import { Page as Service } from './page_service';

export namespace Page {
  export const findAll = async (
    req: Request<never, never, never, Entity.RequestQueryPage>,
    res: Response,
    next: NextFunction,
  ) => {
    const result: Entity.ResponseFindAll = await Service.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  }
}
