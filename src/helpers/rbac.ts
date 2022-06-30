import { AccessControl } from 'accesscontrol'
import { Request } from 'express'
import config from '../config'

export interface AccessControlStruct {
  role: string
  resource: string
  action: string
  attributes: string[]
}

export interface User {
  identifier?: string
  prtnr: boolean
  adm: boolean
}

export const getRole = (user: User) => {
  const partner: string = user.prtnr ? config.get('role.1') : config.get('role.2')
  const role: string = user.adm ? config.get('role.0') : partner

  return role
}

export const getUser = (req: Request): User => {
  const decodeUser = req.user as User

  return {
    identifier: decodeUser.identifier,
    prtnr: decodeUser.prtnr,
    adm: decodeUser.adm,
  }
}

export const accessControl = (flatList: AccessControlStruct[]) => new AccessControl(flatList)
