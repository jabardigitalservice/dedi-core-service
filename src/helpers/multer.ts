import path from 'path'
import lang from '../lang'
import { Express, Request, Response } from 'express'
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

export const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback, type: string) => {
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

  return new Promise((resolve, reject) => {
    upload(requestFile.req, requestFile.res, (err) => {
      if (err) reject(err)
      if (requestFile.isRequired && requestFile.req.file === undefined) {
        const customMessage = {
          attribute: requestFile.fieldName,
        }
        reject(formatError(requestFile.fieldName, lang.__('error.file.doesntExist', customMessage)))
      }
      resolve(requestFile.req.file || null)
    })
  })
}
