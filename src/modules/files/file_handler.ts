import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { File as Entity } from './file_entity'
import { uploadLocalSingle } from '../../helpers/upload'
import { getUrlGCS, uploadGCS } from '../../helpers/gcs'

export namespace File {
  export const upload = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const fieldName = 'file'
      const file = await uploadLocalSingle({ req, res, fieldName })
      const source = uploadGCS(file)
      const result: Entity.ResponseUpload = {
        data: {
          path: getUrlGCS(source),
          original_name: file.originalname,
          source,
        },
        meta: {},
      }
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }
}
