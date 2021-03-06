import path from 'path'
import { Express, Request, RequestHandler, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'
import httpStatus from 'http-status'
import { ParamsDictionary } from 'express-serve-static-core'
import { HttpError } from '../handler/exception'
import lang from '../lang'
import config from '../config'
import { IsJsonString } from './constant'

interface StructErrors {
  [key: string]: string
}

interface RequestFile {
  req: Request
  res: Response
  fieldName: string
}

interface UploadPromise {
  upload: RequestHandler<ParamsDictionary, any, any, any, Record<string, any>>
  requestFile: RequestFile
  fileSize: number
}

type MulterFile = Express.Multer.File | null

const fileType = config.get('file.type')
const fileSize = Number(config.get('file.max')) * 1024 * 1024

const formatError = (fieldName: string, message: string): HttpError => {
  const errors: StructErrors = {
    [fieldName]: message,
  }

  return new HttpError(httpStatus.UNPROCESSABLE_ENTITY, JSON.stringify(errors), true)
}

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback) => {
  const fileTypes = new RegExp(fileType)
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if (mimetype && extname) return cb(null, true)

  const customMessage = {
    attribute: file.fieldname,
    values: fileType.split('|').join(', '),
  }

  cb(formatError(file.fieldname, lang.__('validation.file.mimetypes', customMessage)))
}

const getErrorMessage = (err: any) =>
  IsJsonString(err.message) ? JSON.parse(err.message).file : err.message

const getError = (err: any, requestFile: RequestFile): HttpError => {
  let message: string

  const customMessage = {
    attribute: requestFile.fieldName,
    max: config.get('file.max'),
  }

  if (err && err.code === 'LIMIT_FILE_SIZE') {
    message = lang.__('validation.file.size', customMessage)
  } else if (err && typeof err.code !== 'string') {
    message = getErrorMessage(err)
  } else if (!err && requestFile.req.file === undefined) {
    message = lang.__('validation.any.required', customMessage)
  }

  return message ? formatError(requestFile.fieldName, message) : null
}

const uploadFile = async (file: UploadPromise): Promise<MulterFile> =>
  new Promise((resolve, reject) => {
    file.upload(file.requestFile.req, file.requestFile.res, (err: any) => {
      const error = getError(err, file.requestFile)
      if (error) return reject(error)
      resolve(file.requestFile.req.file || null)
    })
  })

export const uploadLocalSingle = async (requestFile: RequestFile): Promise<MulterFile> => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize },
    fileFilter: (req: Request, file, cb: FileFilterCallback) => {
      checkFileType(file, cb)
    },
  }).single(requestFile.fieldName)

  return uploadFile({
    upload,
    requestFile,
    fileSize,
  })
}
