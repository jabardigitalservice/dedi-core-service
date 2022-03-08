import Joi from 'joi';
import { ValidationWithDB } from '../../helpers/validator';

export namespace User {
  const orderByValid = ['name', 'is_active', 'email']
  const emptyAllow = ['', null]

  const regexPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9&*_]+)$/

  const password = () => Joi.string().min(6).max(72).regex(regexPassword)

  export const findAll = Joi.object({
    order_by: Joi.string().valid(...orderByValid).allow(...emptyAllow),
    is_admin: Joi.boolean().allow(...emptyAllow),
    is_active: Joi.boolean().allow(...emptyAllow),
  })

  const rulesPassword = {
    password: password().required(),
    password_confirm: password().valid(Joi.ref('password')).required(),
  }

  const email = Joi.string().email().max(150).required()

  export const store = Joi.object({
    name: Joi.string().max(100).required(),
    email,
    avatar: Joi.string().max(255).required(),
    avatar_original_name: Joi.string().max(255).required(),
    is_active: Joi.boolean().required(),
    ...rulesPassword,
  })

  const validateWithDB: ValidationWithDB = {
    email: [
      {
        type: 'unique', attr: 'email', table: 'users', column: 'id', params: 'id',
      },
    ],
    avatar: [
      {
        type: 'unique', attr: 'avatar', table: 'users', column: 'avatar', params: 'id',
      },
    ],
  }

  export const storeWithDB = validateWithDB
}
