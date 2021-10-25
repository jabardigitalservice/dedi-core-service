import fs, { unlinkSync } from 'fs'
import config from '../config'
import { s3 } from '../config/aws'
import { Express } from 'express'
import { ManagedUpload } from 'aws-sdk/clients/s3'

export const upload = (file: Express.Multer.File, customDir = '/') => {
  const dir = `${config.get('node.env')}${customDir}`
  const uploadParams = {
    Bucket: config.get('aws.bucket'),
    Body: fs.createReadStream(file.path),
    Key: `${dir}${file.filename}`
  }

  s3.upload(uploadParams, (err: Error, res: ManagedUpload.SendData) => {
    // must be set callback for success upload file
  })

  unlinkSync(file.path)

  return {
    name: file.filename,
    mimetype: file.mimetype,
    path: uploadParams.Key
  }
}

export const getFileUrl = async (path: string): Promise<string> => {
  const params = {
    Bucket: config.get('aws.bucket'),
    Key: path
  }

  try {
    await s3.headObject(params).promise()
    return `${config.get('aws.s3.cloudfront')}/${path}`
  } catch (err) {
    return null
  }
}