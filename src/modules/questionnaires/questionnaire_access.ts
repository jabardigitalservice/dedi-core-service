import config from '../../config'
import { accessControl, AccessControlStruct } from '../../helpers/rbac'
import grantAccess from '../../middleware/grantAccess'

export namespace QuestionnaireAccess {
  const flatList: AccessControlStruct[] = [
    {
      role: config.get('role.0'),
      resource: 'questionnaire',
      action: 'read:any',
      attributes: ['*'],
    },
  ]

  export const ac = accessControl(flatList)

  export const findAll = () => grantAccess(ac, 'readAny', 'questionnaire')
  export const findById = () => grantAccess(ac, 'readAny', 'questionnaire')
}
