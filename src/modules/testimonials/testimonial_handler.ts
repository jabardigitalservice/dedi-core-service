import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Testimonial as Entity } from './testimonial_entity'
import { Testimonial as Service } from './testimonial_service'

export namespace Testimonial {
  export const findAll = async (
    req: Request<never, never, never, Entity.RequestQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const result: Entity.ResponseFindAll = await Service.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  }

  export const store = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { body, user } = req
    await Service.store(body, user)
    res.status(httpStatus.CREATED).json({ message: 'CREATED' })
  }
}
