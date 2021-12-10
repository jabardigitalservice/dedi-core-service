import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { Partner as Entity } from './partner_entity'
import { Partner as Service } from './partner_service'

export namespace Partner {
  export const findAll = async (req: Request<never, never, never, Entity.RequestQuery>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseFindAll = await Service.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  }

  export const suggestion = async (req: Request<never, never, never, Entity.RequestQuerySuggestion>, res: Response, next: NextFunction) => {
    const result: Entity.ResponseSuggestion = await Service.search(req.query)

    res.status(httpStatus.OK).json(result)
  }
}
