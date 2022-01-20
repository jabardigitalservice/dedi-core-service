import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { File as Entity } from './file_entity'
import { getUrlS3, uploadS3 } from '../../helpers/s3'
import { uploadLocalSingle } from '../../helpers/upload'

export namespace File {
  export const upload = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const fieldName = 'file'
      const file = await uploadLocalSingle({ req, res, fieldName })
      const path = uploadS3(file)
      const result: Entity.ResponseUpload = {
        data: {
          path: getUrlS3(path),
          original_name: file.originalname,
          source: file.filename,
        },
        meta: {},
      }
      res.status(httpStatus.OK).json(result)
    } catch (error) {
      next(error)
    }
  }
}
