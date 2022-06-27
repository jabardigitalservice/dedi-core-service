import Joi from 'joi'
import { regexAlphanumeric } from '../../helpers/regex'

export namespace PartnerRules {
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    is_verified: Joi.boolean().allow(...emptyAllow),
    name: Joi.string()
      .regex(regexAlphanumeric)
      .allow(...emptyAllow),
  })
}
