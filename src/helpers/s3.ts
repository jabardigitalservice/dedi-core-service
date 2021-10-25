import fs, { unlinkSync } from 'fs'
import config from '../config'
import { s3 } from '../config/aws'
import { Express } from 'express'

export const upload = async (file: Express.Multer.File, customDir = '/') => {
  const dir = `${config.get('node.env')}${customDir}`
  const uploadParams = {
    Bucket: config.get('aws.bucket'),
    Body: fs.createReadStream(file.path),
    Key: `${dir}${file.filename}`
  }

  try {
    const response = await s3.upload(uploadParams).promise()
    unlinkSync(file.path)
    return {
      name: file.filename,
      mimetype: file.mimetype,
      path: response.Key
    }
  } catch (error) {
    console.log(error.message);
    throw error
  }
}

export const getUrl = (path: string) => {
  return `${config.get('aws.s3.cloudfront')}/${path}`
}
