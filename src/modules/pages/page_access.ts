import config from '../../config'
import { accessControl } from '../../helpers/rbac'
import grantAccess from '../../middleware/grantAccess'

export namespace Page {
  const flatList = [
    {
      role: config.get('role.0'), resource: 'page', action: 'read:any', attributes: ['*'],
    },
    {
      role: config.get('role.0'), resource: 'page', action: 'create:any', attributes: ['*'],
    },
    {
      role: config.get('role.0'), resource: 'page', action: 'delete:any', attributes: ['*'],
    },
    {
      role: config.get('role.0'), resource: 'page', action: 'update:any', attributes: ['*'],
    },
  ]

  export const ac = accessControl(flatList)

  export const findById = () => grantAccess(ac, 'readAny', 'page')
  export const store = () => grantAccess(ac, 'createAny', 'page')
  export const destroy = () => grantAccess(ac, 'deleteAny', 'page')
  export const update = () => grantAccess(ac, 'updateAny', 'page')
}
