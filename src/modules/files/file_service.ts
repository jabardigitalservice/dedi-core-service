import { Request, Response } from 'express'
import { File as Entity } from './file_entity'
import { uploadLocalSingle } from '../../helpers/upload'
import { getUrlGCS, uploadGCS } from '../../helpers/gcs'

export namespace File {
  export const upload = async (req: Request, res: Response) => {
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

    return result
  }
}
