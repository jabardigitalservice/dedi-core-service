import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import config from '../config'
import { HttpError } from '../handler/exception'
import lang from '../lang'
import { verifyAccessToken } from './jwt'

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization, 'x-api-key': xApiKey } = req.headers

  if (!authorization && xApiKey !== config.get('app.secret')) {
    return next(new HttpError(httpStatus.FORBIDDEN, lang.__('auth.grant.access')))
  }

  if (authorization) {
    return verifyAccessToken(req, res, next)
  }

  return next()
}
