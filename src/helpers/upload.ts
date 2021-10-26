import path from 'path'
import lang from '../lang'
import { Express, Request, RequestHandler, Response } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { HttpError } from '../handler/exception'
import httpStatus from 'http-status'
import storage from '../config/storage'

interface StructErrors {
  [key: string]: string[]
}

interface RequestFile {
  req: Request
  res: Response
  allowFileType: string
  fieldName: string
  fileSize?: number
  isRequired?: boolean
}

const formatError = (fieldName: string, message: string) => {
  const errors: StructErrors = {
    [fieldName]: [message]
  }

  return new HttpError(httpStatus.UNPROCESSABLE_ENTITY, JSON.stringify(errors), true)
}

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback, type: string) => {
  const fileTypes = new RegExp(type)
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if (mimetype && extname) return cb(null, true)

  const customMessage = {
    attribute: file.fieldname,
    values: type.split('|').join(', ')
  }

  cb(formatError(file.fieldname, lang.__('error.file.mimetypes', customMessage)))
}

const getError = (err: any, requestFile: RequestFile) => {
  let error: any = null

  const customMessage = {
    attribute: requestFile.fieldName,
  }

  if (err && err.code === 'LIMIT_FILE_SIZE') {
    error = formatError(requestFile.fieldName, lang.__('error.file.size', customMessage))
  }
  if (err) {
    error = err
  }
  if (requestFile.isRequired && requestFile.req.file === undefined) {
    error = formatError(requestFile.fieldName, lang.__('error.file.doesntExist', customMessage))
  }

  return error
}

const uploadPromise = (upload: RequestHandler, requestFile: RequestFile): Promise<Express.Multer.File | null> => {
  return new Promise((resolve, reject) => {
    upload(requestFile.req, requestFile.res, (err: any) => {
      const error = getError(err, requestFile)
      if (error) reject(error)
      resolve(requestFile.req.file || null)
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

  return uploadPromise(upload, requestFile)
}
