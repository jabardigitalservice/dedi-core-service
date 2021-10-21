import Sentry from '../config/sentry'
import { CustomError } from 'ts-custom-error'
import httpStatus from 'http-status'
import config from '../config'
import { Request, Response, NextFunction } from 'express'
import logger from '../helpers/logger'

export const onError = (error: any, req: Request, res: Response, next: NextFunction) => {
  error.code = typeof error.code === 'string' ? error.status || httpStatus.INTERNAL_SERVER_ERROR : error.code

  if (error.code >= httpStatus.INTERNAL_SERVER_ERROR) {
    logger({
      level: 'error',
      message: error.message,
      data: {
        method: req.method,
        userAgent: req.headers['user-agent'],
      },
      service: req.path,
      activity: (httpStatus[Number(error.code)]).toString()
    })

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
