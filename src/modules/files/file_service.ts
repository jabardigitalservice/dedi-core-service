import { Request, Response } from 'express'
import { File as Entity } from './file_entity'
import { uploadLocalSingle } from '../../helpers/upload'
import { getUrlCloudStorage, uploadCloudStorage } from '../../helpers/cloudStorage'

export namespace File {
  export const upload = async (req: Request, res: Response) => {
    const fieldName = 'file'
    const file = await uploadLocalSingle({ req, res, fieldName })
    const source = uploadCloudStorage(file)

    const result: Entity.ResponseUpload = {
      data: {
        path: getUrlCloudStorage(source),
        original_name: file.originalname,
        source,
      },
      meta: {},
    }

    return result
  }
}
