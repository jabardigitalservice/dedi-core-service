import config from '../config'
import { uploadGCS } from './gcs'
import { uploadS3 } from './s3'

const getFullUrl = (path: string, cdn: string) => (path ? `${cdn}/${config.get('node.env')}/${path}` : null)

const defaultCloudStorage = config.get('cloud.storage', 's3')

export const getUrl = (path: string) => {
  const cdn = defaultCloudStorage === 's3' ? config.get('aws.s3.cloudfront') : config.get('gcs.cdn')

  return getFullUrl(path, cdn)
}

export const uploadFile = (file: Express.Multer.File) => (defaultCloudStorage === 's3' ? uploadS3(file) : uploadGCS(file))
