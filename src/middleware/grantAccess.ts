import { AccessControl } from 'accesscontrol'
import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { HttpError } from '../handler/exception'
import { getRole } from '../helpers/rbac'
import lang from '../lang'

export default (
  accessControl: AccessControl,
  action: string,
  resource: string,
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = getRole(req.user)
    const permission = accessControl.can(role)[action](resource);

    if (!permission.granted) throw new Error()

    next()
  } catch (error) {
    next(new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.grant.access')))
  }
}
