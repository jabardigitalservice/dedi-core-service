import fs, { unlinkSync } from 'fs'
import { Express } from 'express'
import config from '../config'
import { GCS } from '../config/cloudStorage'

const bucket = GCS.bucket(config.get('gcs.bucket'));

export const uploadGCS = (file: Express.Multer.File): string => {
  const Key = `${config.get('node.env')}/${file.filename}`
  const blob = bucket.file(Key);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('finish', async () => {
    await bucket.file(Key).makePublic();
  });

  const Body = fs.createReadStream(file.path)
  let buffers: string;
  Body.on('data', (data) => {
    buffers += data;
  }).on('end', () => {
    blobStream.end(buffers);
  });

  unlinkSync(file.path)

  return file.filename
}

export const getUrlGCS = (path: string) => {
  const url = `${config.get('gcs.cdn')}/${config.get('node.env')}/${path}`

  return url
}
