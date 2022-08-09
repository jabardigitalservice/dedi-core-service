import config from '../../config'
import { accessControl, AccessControlStruct } from '../../helpers/rbac'
import grantAccess from '../../middleware/grantAccess'

export namespace VillageAccess {
  const flatList: AccessControlStruct[] = [
    {
      role: config.get('role.0'),
      resource: 'village',
      action: 'read:any',
      attributes: ['*'],
    },
    {
      role: config.get('role.0'),
      resource: 'village',
      action: 'create:any',
      attributes: ['*'],
    },
    {
      role: config.get('role.0'),
      resource: 'village',
      action: 'delete:any',
      attributes: ['*'],
    },
    {
      role: config.get('role.0'),
      resource: 'village',
      action: 'update:any',
      attributes: ['*'],
    },
  ]

  export const ac = accessControl(flatList)

  export const store = () => grantAccess(ac, 'createAny', 'village')
}
