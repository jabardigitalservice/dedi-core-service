import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import config from '../config'
import { HttpError } from '../handler/exception'
import lang from '../lang'
import { verifyAccessToken } from './jwt'

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  const { secret } = req.query

  if (!authorization && secret !== config.get('app.secret')) {
    next(new HttpError(httpStatus.FORBIDDEN, lang.__('auth.grant.access')))
  }

  if (authorization) {
    return verifyAccessToken(req, res, next)
  }

  next()
}
