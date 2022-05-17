import config from '../config'
import { isCloudStorageS3 } from './constant'
import { uploadGCS } from './gcs'
import { uploadS3 } from './s3'

export const getUrl = (path: string) => {
  const cdn = isCloudStorageS3() ? config.get('aws.s3.cloudfront') : config.get('gcs.cdn')

  return path ? `${cdn}/${config.get('node.env')}/${path}` : null
}

export const uploadFile = (file: Express.Multer.File) => (isCloudStorageS3() ? uploadS3(file) : uploadGCS(file))
