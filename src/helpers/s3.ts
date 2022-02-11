import { Express } from 'express'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { DeleteObjectOutput, ManagedUpload } from 'aws-sdk/clients/s3'
import config from '../config'
import { s3 } from '../config/cloudStorage'
import Sentry from '../config/sentry';

const Bucket = config.get('aws.bucket')

export const uploadS3 = (file: Express.Multer.File): string => {
  const filename = uuidv4() + path.extname(file.originalname)
  const Key = `${config.get('node.env')}/${filename}`
  const Body = file.buffer

  const params = { Bucket, Body, Key }
  s3.upload(params, (err: Error, res: ManagedUpload.SendData) => {
    if (err) Sentry.captureException(err)
  })

  return filename
}

export const getUrlS3 = (path: string) => {
  const url = `${config.get('aws.s3.cloudfront')}/${config.get('node.env')}/${path}`

  return url
}

export const removeS3 = (path: string) => {
  const Key = `${config.get('node.env')}/${path}`

  const params = { Bucket, Key }
  s3.deleteObject(params, (err: Error, data: DeleteObjectOutput) => {
    if (err) console.log(err.message)
  })
}
