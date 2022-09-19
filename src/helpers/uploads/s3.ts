import { Express } from 'express'
import { ManagedUpload } from 'aws-sdk/clients/s3'
import newrelic from 'newrelic'
import config from '../../config'
import { s3 } from '../../config/cloudStorage'

const Bucket = config.get('aws.bucket')

export const uploadS3 = (file: Express.Multer.File, Key: string) => {
  const Body = file.buffer

  const params = { Bucket, Body, Key }
  s3.upload(params, (error: Error, res: ManagedUpload.SendData) => {
    if (error) newrelic.noticeError(error)
  })
}
