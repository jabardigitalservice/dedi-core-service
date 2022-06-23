import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { getUrl } from '../../helpers/cloudStorage'
import { File as Entity } from './file_entity'
import { File as Service } from './file_service'

export namespace File {
  export const upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result: Entity.ResponseUpload = await Service.upload(req, res)

      return res.status(httpStatus.OK).json(result)
    } catch (error) {
      return next(error)
    }
  }

  export const download = async (req: Request, res: Response, next: NextFunction) => {
    const source = req.params.filename

    const result: Entity.ResponseUpload = {
      data: {
        path: getUrl(source),
        original_name: source,
        source,
      },
      meta: {},
    }

    return res.status(httpStatus.OK).json(result)
  }
}
