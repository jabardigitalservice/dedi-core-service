import { AccessControl } from 'accesscontrol'
import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { HttpError } from '../handler/exception'
import { getRole } from '../helpers/roles'
import lang from '../lang'

export const grantAccess = (
  roles: AccessControl,
  action: string,
  resource: string,
) => async (req: Request, res: Response, next: NextFunction) => {
  const role = getRole(req.user)
  const permission = roles.can(role)[action](resource);

  if (permission.granted) return next();

  next(new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.grant.access')))
}
