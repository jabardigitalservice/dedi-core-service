import fs, { unlinkSync } from 'fs'
import { Express } from 'express'
import { ManagedUpload } from 'aws-sdk/clients/s3'
import config from '../config'
import { s3 } from '../config/aws'

export const uploadS3 = (file: Express.Multer.File, customDir = '/'): string => {
  const dir = `${config.get('node.env')}${customDir}`
  const Key = `${dir}${file.filename}`
  const uploadParams = {
    Bucket: config.get('aws.bucket'),
    Body: fs.createReadStream(file.path),
    Key,
  }

  s3.upload(uploadParams, (err: Error, res: ManagedUpload.SendData) => {
    if (err) console.log(err.message);
  })

  unlinkSync(file.path)

  return Key
}
