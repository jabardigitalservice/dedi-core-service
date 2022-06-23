import httpStatus from 'http-status'
import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../handler/exception'
import config from '../config'

export default (req: Request, res: Response, next: NextFunction) => {
  // Set the timeout for all HTTP requests
  req.setTimeout(Number(config.get('http.timeout', 30000)), () =>
    next(new HttpError(httpStatus.REQUEST_TIMEOUT, httpStatus[408]))
  )
  // Set the server response timeout for all HTTP requests
  res.setTimeout(Number(config.get('http.timeout', 30000)), () =>
    next(new HttpError(httpStatus.SERVICE_UNAVAILABLE, httpStatus[503]))
  )
  return next()
}
