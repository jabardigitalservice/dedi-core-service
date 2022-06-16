import config from '../../config'
import { accessControl, AccessControlStruct } from '../../helpers/rbac'
import grantAccess from '../../middleware/grantAccess'

export namespace User {
  const flatList: AccessControlStruct[] = [
    {
      role: config.get('role.0'),
      resource: 'user',
      action: 'read:any',
      attributes: ['*'],
    },
    {
      role: config.get('role.0'),
      resource: 'user',
      action: 'create:any',
      attributes: ['*'],
    },
    {
      role: config.get('role.0'),
      resource: 'user',
      action: 'delete:any',
      attributes: ['*'],
    },
    {
      role: config.get('role.0'),
      resource: 'user',
      action: 'update:any',
      attributes: ['*'],
    },
  ]

  export const ac = accessControl(flatList)

  export const store = () => grantAccess(ac, 'createAny', 'user')
  export const update = () => grantAccess(ac, 'updateAny', 'user')
  export const updateStatus = () => grantAccess(ac, 'updateAny', 'user')
  export const destroy = () => grantAccess(ac, 'deleteAny', 'user')
  export const findById = () => grantAccess(ac, 'readAny', 'user')
  export const findAll = () => grantAccess(ac, 'readAny', 'user')
}
