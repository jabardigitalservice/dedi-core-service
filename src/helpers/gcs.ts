import { Express } from 'express'
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import newrelic from 'newrelic'
import config from '../config'
import { GCS } from '../config/cloudStorage'

export const uploadGCS = (file: Express.Multer.File): string => {
  const bucket = GCS.bucket(config.get('gcs.bucket'));
  const filename = uuidv4() + path.extname(file.originalname)
  const Key = `${config.get('node.env')}/${filename}`

  const blob = bucket.file(Key);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err: Error) => {
    newrelic.noticeError(err)
  })

  blobStream.end(file.buffer);

  return filename
}
