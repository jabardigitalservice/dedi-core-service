import Joi from 'joi'
import { ValidationWithDB } from '../../helpers/validator'

export namespace User {
  const orderByValid = ['name', 'is_active', 'email', 'updated_at']
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    order_by: Joi.string()
      .valid(...orderByValid)
      .allow(...emptyAllow),
    is_admin: Joi.boolean().allow(...emptyAllow),
    is_active: Joi.boolean().allow(...emptyAllow),
  })

  const email = Joi.string().email().max(150).required()

  const validate = {
    name: Joi.string().min(3).max(100).required(),
    email,
    avatar: Joi.string().max(255).required(),
    avatar_original_name: Joi.string().max(255).required(),
  }

  export const store = Joi.object({
    ...validate,
    password: Joi.string().min(8).required(),
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
