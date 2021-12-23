import fs, { unlinkSync } from 'fs'
import { Express } from 'express'
import { DeleteObjectOutput, ManagedUpload } from 'aws-sdk/clients/s3'
import config from '../config'
import { s3 } from '../config/aws'

const Bucket = config.get('aws.bucket')

export const uploadS3 = (file: Express.Multer.File): string => {
  const Key = `${config.get('node.env')}/${file.filename}`
  const Body = fs.createReadStream(file.path)

  const params = { Bucket, Body, Key }
  s3.upload(params, (err: Error, res: ManagedUpload.SendData) => {
    if (err) console.log(err.message)
  })

  unlinkSync(file.path)

  return file.filename
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
