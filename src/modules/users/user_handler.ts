import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { User as Entity } from './user_entity'
import { User as Service } from './user_service'

export namespace User {
  export const findAll = async (
    req: Request<never, never, never, Entity.RequestQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const result: Entity.ResponseFindAll = await Service.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  }

  export const findById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params
      const result: Entity.ResponseFindById = await Service.findById(id)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  export const destroy = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params
      await Service.destroy(id)
      res.status(httpStatus.OK).json({ message: 'DELETED' })
    } catch (error) {
      next(error)
    }
  }
}
