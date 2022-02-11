import { Express } from 'express'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import config from '../config'
import { GCS } from '../config/cloudStorage'
import Sentry from '../config/sentry';

export const uploadGCS = (file: Express.Multer.File): string => {
  const bucket = GCS.bucket(config.get('gcs.bucket'));
  const filename = uuidv4() + path.extname(file.originalname)
  const Key = `${config.get('node.env')}/${filename}`

  const blob = bucket.file(Key);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err: Error) => {
    Sentry.captureException(err)
  })

  blobStream.end(file.buffer);

  return filename
}

export const getUrlGCS = (path: string) => {
  const url = `${config.get('gcs.cdn')}/${config.get('node.env')}/${path}`

  return url
}
