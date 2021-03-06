import { Express } from 'express'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { ManagedUpload } from 'aws-sdk/clients/s3'
import newrelic from 'newrelic'
import config from '../config'
import { s3 } from '../config/cloudStorage'

const Bucket = config.get('aws.bucket')

export const uploadS3 = (file: Express.Multer.File): string => {
  const filename = uuidv4() + path.extname(file.originalname)
  const Key = `${config.get('node.env')}/${filename}`
  const Body = file.buffer

  const params = { Bucket, Body, Key }
  s3.upload(params, (error: Error, res: ManagedUpload.SendData) => {
    if (error) newrelic.noticeError(error)
  })

  return filename
}
