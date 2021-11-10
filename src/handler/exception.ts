import Sentry from '../config/sentry'
import { CustomError } from 'ts-custom-error'
import httpStatus from 'http-status'
import { Request, Response, NextFunction } from 'express'
import { isNodeEnvProduction } from '../helpers/constant'

const isErrorCodeNotNumber = (error: any) => typeof error.code === 'string' || typeof error.code === 'undefined'
const isErrorJwt = (error: any) => error.message === 'jwt malformed'
const isErrorServer = (error: any) => error.code >= httpStatus.INTERNAL_SERVER_ERROR
const isErrorProduction = (error: any) => isNodeEnvProduction() && isErrorServer(error)

export const onError = (error: any, req: Request, res: Response, next: NextFunction) => {
  error.code = isErrorCodeNotNumber(error) ? error.status || httpStatus.INTERNAL_SERVER_ERROR : error.code

  if (error.code >= httpStatus.INTERNAL_SERVER_ERROR) {
    const logger = {
      level: 'error',
      message: error.message,
      method: req.method,
      userAgent: req.headers['user-agent'],
      path: req.path,
      code: error.code
    }

    console.log(JSON.stringify(logger));

    Sentry.captureException(error, {
      tags: logger,
      user: req.user
    });

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

  const message: string = isErrorProduction(error) || isErrorJwt(error) ? httpStatus[Number(error.code)] : error.message

  return { error: message }
}
