import config from '../../config'
import { accessControl } from '../../helpers/rbac'
import grantAccess from '../../middleware/grantAccess'

export namespace Page {
  const flatList = [
    {
      role: config.get('role.0'), resource: 'page', action: 'read:any', attributes: ['*'],
    },
  ]

  export const ac = accessControl(flatList)

  export const findAll = () => grantAccess(ac, 'readAny', 'page')
  export const findById = () => grantAccess(ac, 'readAny', 'page')
}
