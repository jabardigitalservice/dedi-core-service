import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import config from '../config'
import { HttpError } from '../handler/exception'
import roles from '../helpers/roles'
import lang from '../lang'

export default (action: string, resource: string) => async (req: Request, res: Response, next: NextFunction) => {
  const decodeJwt: any = req.user

  const partner = decodeJwt.prtnr ? config.get('role.1') : config.get('role.2')
  const role = decodeJwt.adm ? config.get('role.0') : partner

  const permission = roles.can(role)[action](resource);

  if (!permission.granted) next(new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.grant.access')));

  next()
}
