import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { File as Entity } from './file_entity'
import { File as Service } from './file_service'

export namespace File {
  export const upload = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result: Entity.ResponseUpload = await Service.upload(req, res)

      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }
}
