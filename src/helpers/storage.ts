import { Express } from 'express'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import config from '../config'
import { uploadGCS } from './uploads/gcs'
import { uploadS3 } from './uploads/s3'

export const StorageUrl = (): string => {
  let url: string
  switch (config.get('filesystem.driver')) {
    case 's3':
      url = config.get('aws.s3.cloudfront')
      break
    default:
      url = config.get('gcs.cdn')
      break
  }
  return url
}

export const getUrl = (path: string) =>
  path ? `${StorageUrl()}/${config.get('node.env')}/${path}` : null

export const getOriginalName = (originalName: string) => originalName || null

export const uploadFile = (file: Express.Multer.File) => {
  const filename = uuidv4() + path.extname(file.originalname)
  const Key = `${config.get('node.env')}/${filename}`

  switch (config.get('filesystem.driver')) {
    case 's3':
      uploadS3(file, Key)
      break
    default:
      uploadGCS(file, Key)
      break
  }

  return filename
}
