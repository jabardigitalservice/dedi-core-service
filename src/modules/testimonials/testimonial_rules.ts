import Joi from 'joi'
import config from '../../config'
import { regexAlphanumeric, regexCodeRegion, regexExtFile } from '../../helpers/regex'
import { ValidationWithDB } from '../../helpers/validator'

export namespace TestimonialRules {
  const orderByValid = ['type', 'is_active', 'created_at']
  const emptyAllow = ['', null]
  const typeValid = [config.get('role.1'), config.get('role.2')]

  export const findAll = Joi.object({
    order_by: Joi.string()
      .valid(...orderByValid)
      .allow(...emptyAllow),
    is_active: Joi.boolean().allow(...emptyAllow),
  })

  const validate = Joi.object({
    name: Joi.string().regex(regexAlphanumeric).max(100).required(),
    description: Joi.string().regex(regexAlphanumeric).required(),
    avatar: Joi.string().regex(regexExtFile).max(255).required(),
    avatar_original_name: Joi.string().regex(regexExtFile).max(255).required(),
    type: Joi.string()
      .valid(...typeValid)
      .required(),
    is_active: Joi.boolean().required(),
    partner_id: Joi.alternatives().conditional('type', {
      is: config.get('role.1'),
      then: Joi.string().uuid().max(36).required(),
      otherwise: Joi.string().valid(null),
    }),
    village_id: Joi.alternatives().conditional('type', {
      is: config.get('role.2'),
      then: Joi.string().regex(regexCodeRegion).max(14).required(),
      otherwise: Joi.string().valid(null),
    }),
  })

  export const store = validate
  export const update = validate

  const validateWithDB: ValidationWithDB = {
    partner_id: [
      {
        type: 'exists',
        attr: 'partner_id',
        table: 'partners',
        column: 'id',
      },
    ],
    village_id: [
      {
        type: 'exists',
        attr: 'village_id',
        table: 'villages',
        column: 'id',
      },
    ],
    avatar: [
      {
        type: 'unique',
        attr: 'avatar',
        table: 'testimonials',
        column: 'avatar',
        params: 'id',
      },
    ],
  }

  export const storeWithDB = validateWithDB
  export const updateWithDB = validateWithDB
}
