import Sentry from '../config/sentry'
import { CustomError } from 'ts-custom-error'
import httpStatus from 'http-status'
import config from '../config'
import { Request, Response, NextFunction } from 'express'

const isErrorCode = (error: any) => typeof error.code === 'string' || typeof error.code === 'undefined'

export const onError = (error: any, req: Request, res: Response, next: NextFunction) => {
  error.code = isErrorCode(error) ? error.status || httpStatus.INTERNAL_SERVER_ERROR : error.code

  if (error.code >= httpStatus.INTERNAL_SERVER_ERROR) {
    const logger = JSON.stringify({
      level: 'error',
      message: error.message,
      method: req.method,
      userAgent: req.headers['user-agent'],
      path: req.path,
      code: error.code
    })

    console.log(logger);

    Sentry.captureException(error)
  }

  return res.status(error.code).json(messageError(error))
}

export class HttpError extends CustomError {
  public constructor (
      public code: number,
      message?: string,
      public isObject: boolean = false
  ) {
    super(message)
  }
}

const messageError = (error: any) => {
  if (error.isObject) return { errors: JSON.parse(error.message) }

  const isEnvProduction: boolean = config.get('node.env') === 'production' && error.code >= httpStatus.INTERNAL_SERVER_ERROR
  const message: string = isEnvProduction ? httpStatus[Number(error.code)] : error.message

  return { error: message }
}
