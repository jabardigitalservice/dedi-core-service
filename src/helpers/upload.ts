import path from 'path'
import lang from '../lang'
import { Express, Request, RequestHandler, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { HttpError } from '../handler/exception'
import httpStatus from 'http-status'
import storage from '../config/storage'
import { ParamsDictionary } from 'express-serve-static-core'

interface StructErrors {
  [key: string]: string[]
}

interface RequestFile {
  req: Request
  res: Response
  fieldName: string
  allowFileType?: string
  fileSize?: number
  isRequired?: boolean
}

interface UploadPromise {
  upload: RequestHandler<ParamsDictionary, any, any, any, Record<string, any>>
  requestFile: RequestFile
}

const formatError = (fieldName: string, message: string): HttpError => {
  const errors: StructErrors = {
    [fieldName]: [message]
  }

  return new HttpError(httpStatus.UNPROCESSABLE_ENTITY, JSON.stringify(errors), true)
}

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback, type: string = 'png|jpg|jpeg') => {
  const fileTypes = new RegExp(type)
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if (mimetype && extname) return cb(null, true)

  const customMessage = {
    attribute: file.fieldname,
    values: type.split('|').join(', ')
  }

  cb(formatError(file.fieldname, lang.__('validation.file.mimetypes', customMessage)))
}

const getError = (err: any, requestFile: RequestFile): HttpError => {
  const error: HttpError = formatError(requestFile.fieldName, null)

  const customMessage = {
    attribute: requestFile.fieldName,
    max: requestFile.fileSize.toString()
  }

  if (err && err.code === 'LIMIT_FILE_SIZE') {
    error.message = lang.__('validation.file.size', customMessage)
  } else if (err && typeof err.code !== 'string') {
    error.message = err.message
  } else if (!err && requestFile.isRequired && requestFile.req.file === undefined) {
    error.message = lang.__('validation.any.required', customMessage)
  }

  return error
}

const uploadPromise = (file: UploadPromise): Promise<Express.Multer.File | null> => {
  return new Promise((resolve, reject) => {
    file.upload(file.requestFile.req, file.requestFile.res, (err: any) => {
      const error = getError(err, file.requestFile)
      const isError = JSON.parse(error.message)
      if (isError[file.requestFile.fieldName][0]) reject(error)
      resolve(file.requestFile.req.file || null)
    })
  })
}

export const uploadLocalSingle = (requestFile: RequestFile): Promise<Express.Multer.File | null> => {
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: requestFile.fileSize
    },
    fileFilter: (req: Request, file, cb: FileFilterCallback) => {
      checkFileType(file, cb, requestFile.allowFileType)
    }
  })
    .single(requestFile.fieldName)

  return uploadPromise({
    upload,
    requestFile
  })
}
