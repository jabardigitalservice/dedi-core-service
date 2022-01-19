import config from '../../config'
import { accessControl, AccessControlStruct } from '../../helpers/rbac'
import grantAccess from '../../middleware/grantAccess'

export namespace Testimonial {
  const flatList: AccessControlStruct[] = [
    {
      role: config.get('role.0'), resource: 'testimonial', action: 'read:any', attributes: ['*'],
    },
    {
      role: config.get('role.0'), resource: 'testimonial', action: 'create:any', attributes: ['*'],
    },
    {
      role: config.get('role.0'), resource: 'testimonial', action: 'delete:any', attributes: ['*'],
    },
    {
      role: config.get('role.0'), resource: 'testimonial', action: 'update:any', attributes: ['*'],
    },
  ]

  export const ac = accessControl(flatList)

  export const store = () => grantAccess(ac, 'createAny', 'testimonial')
  export const destroy = () => grantAccess(ac, 'deleteAny', 'testimonial')
  export const findById = () => grantAccess(ac, 'readAny', 'testimonial')
}
