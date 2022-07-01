import { CustomError } from 'ts-custom-error'
import httpStatus from 'http-status'
import { Request, Response, NextFunction } from 'express'
import newrelic from 'newrelic'
import { isNodeEnvProduction } from '../helpers/constant'
import { logger } from '../helpers/logger'

const isErrorCodeNotNumber = (error: any) =>
  typeof error.code === 'string' || typeof error.code === 'undefined'
const isErrorJwt = (error: any) => error.message === 'jwt malformed'
const isErrorServer = (error: any) => error.code >= httpStatus.INTERNAL_SERVER_ERROR
const isErrorProduction = (error: any) => isNodeEnvProduction() && isErrorServer(error)

const messageError = (error: any) => {
  if (error.isObject) return { errors: JSON.parse(error.message) }

  const isErrorProdOrJwt = isErrorProduction(error) || isErrorJwt(error)

  const message: string = isErrorProdOrJwt ? httpStatus[Number(error.code)] : error.message

  return { error: message }
}

export const onError = (error: any, req: Request, res: Response, next: NextFunction) => {
  const isErrorStatusEmpty = error.status || httpStatus.INTERNAL_SERVER_ERROR

  error.code = isErrorCodeNotNumber(error) ? isErrorStatusEmpty : error.code

  if (error.code >= httpStatus.INTERNAL_SERVER_ERROR) {
    const payloadError = {
      level: 'error',
      message: error.message,
      method: req.method,
      userAgent: req.headers['user-agent'],
      path: req.path,
      code: error.code,
      user: JSON.stringify(req.user),
    }

    logger.info(payloadError)

    newrelic.noticeError(error, payloadError)
  }

  return res.status(error.code).json(messageError(error))
}

export class HttpError extends CustomError {
  public constructor(public code: number, message?: string, public isObject: boolean = false) {
    super(message)
  }
}
