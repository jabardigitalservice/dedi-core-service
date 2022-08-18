import Joi from 'joi'
import config from '../../config'
import { regexAlphanumeric, regexExtFile } from '../../helpers/regex'
import { ValidationWithDB } from '../../helpers/validator'

export namespace UserRules {
  const orderByValid = [
    'users.name',
    'users.is_active',
    'users.email',
    'users.updated_at',
    'users.status_partner',
    'partners.name',
  ]
  const roles = [config.get('role.0'), config.get('role.1')]
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    order_by: Joi.string()
      .valid(...orderByValid)
      .allow(...emptyAllow),
    is_admin: Joi.boolean().allow(...emptyAllow),
    is_active: Joi.boolean().allow(...emptyAllow),
    roles: Joi.string()
      .valid(...[config.get('role.1')])
      .allow(...emptyAllow),
  })

  const email = Joi.string().email().max(150).required()

  const validate = {
    name: Joi.string().regex(regexAlphanumeric).trim().min(3).max(100).required(),
    email,
    roles: Joi.string()
      .valid(...roles)
      .required(),
    company: Joi.alternatives().conditional('roles', {
      is: config.get('role.1'),
      then: Joi.string().regex(regexAlphanumeric).required(),
      otherwise: Joi.optional(),
    }),
    avatar: Joi.string().regex(regexExtFile).max(255).required(),
    avatar_original_name: Joi.string().regex(regexExtFile).max(255).required(),
  }

  export const store = Joi.object({
    ...validate,
    password: Joi.alternatives().conditional('roles', {
      is: config.get('role.0'),
      then: Joi.string().regex(regexAlphanumeric).min(8).required(),
      otherwise: Joi.optional(),
    }),
  })

  export const update = Joi.object({
    ...validate,
  })

  export const updateStatus = Joi.object({
    is_active: Joi.boolean().required(),
  })

  const validateWithDB: ValidationWithDB = {
    email: [
      {
        type: 'unique',
        attr: 'email',
        table: 'users',
        column: 'email',
        params: 'id',
      },
    ],
    avatar: [
      {
        type: 'unique',
        attr: 'avatar',
        table: 'users',
        column: 'avatar',
        params: 'id',
      },
    ],
  }

  export const storeWithDB = validateWithDB
  export const updateWithDB = validateWithDB
}
