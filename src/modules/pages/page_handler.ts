import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Page as Entity } from './page_entity'
import { Page as Service } from './page_service'

export namespace Page {
  export const findAll = async (
    req: Request<never, never, never, Entity.RequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const result: Entity.ResponseFindAll = await Service.findAll(req.query)

    res.status(httpStatus.OK).json(result)
  }

  export const findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result: Entity.ResponseFindById = await Service.findById(id)
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }

  export const store = async (req: Request, res: Response, next: NextFunction) => {
    const { body, user } = req
    await Service.store(body, user)
    res.status(httpStatus.CREATED).json({ message: 'CREATED' })
  }

  export const destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await Service.destroy(id)
      res.status(httpStatus.OK).json({ message: 'DELETED' })
    } catch (error) {
      next(error)
    }
  }

  export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { body } = req
      await Service.update(body, id)
      res.status(httpStatus.OK).json({ message: 'UPDATED' })
    } catch (error) {
      next(error)
    }
  }
}
