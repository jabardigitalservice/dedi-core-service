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
  ]

  export const ac = accessControl(flatList)

  export const findById = () => grantAccess(ac, 'readAny', 'page')
  export const Store = () => grantAccess(ac, 'createAny', 'page')
}
