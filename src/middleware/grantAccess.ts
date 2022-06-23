import { AccessControl } from 'accesscontrol'
import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { HttpError } from '../handler/exception'
import { getRole, getUser } from '../helpers/rbac'
import lang from '../lang'

export default (accessControl: AccessControl, action: string, resource: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getUser(req)
      const role = getRole(user)
      const permission = accessControl.can(role)[action](resource)

      if (!permission.granted) throw new Error()

      return next()
    } catch (error) {
      return next(new HttpError(httpStatus.UNAUTHORIZED, lang.__('auth.grant.access')))
    }
  }
