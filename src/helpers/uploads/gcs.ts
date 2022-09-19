import { Express } from 'express'
import newrelic from 'newrelic'
import config from '../../config'
import { GCS } from '../../config/cloudStorage'

export const uploadGCS = (file: Express.Multer.File, Key: string) => {
  const bucket = GCS.bucket(config.get('gcs.bucket'))

  const blob = bucket.file(Key)
  const blobStream = blob.createWriteStream({
    resumable: false,
  })

  blobStream.on('error', (err: Error) => {
    newrelic.noticeError(err)
  })

  blobStream.end(file.buffer)
}
