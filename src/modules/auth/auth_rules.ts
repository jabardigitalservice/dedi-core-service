import Joi from 'joi'
import { regexAlphanumeric } from '../../helpers/regex'
import { ValidationWithDB } from '../../helpers/validator'

export namespace AuthRules {
  const regexPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9&*+?.,^|&]+)$/

  const password = () => Joi.string().min(6).max(72).regex(regexPassword)

  const rulesPassword = {
    password: password().required(),
    password_confirm: password().valid(Joi.ref('password')).required(),
  }

  const email = Joi.string().email().max(150).required()

  export const signUp = Joi.object({
    name: Joi.string().regex(regexAlphanumeric).max(100).required(),
    company: Joi.string().regex(regexAlphanumeric).allow(null).default(null),
    partner_id: Joi.string().allow(null).default(null),
    email,
    ...rulesPassword,
  })

  export const signIn = Joi.object({
    email,
    password: Joi.string().required(),
  })

  export const refreshToken = Joi.object({
    refresh_token: Joi.string().required(),
  })

  export const forgotPassword = Joi.object({
    email,
  })

  export const resetPassword = Joi.object({
    ...rulesPassword,
  })

  export const signUpWithDB: ValidationWithDB = {
    email: [
      {
        type: 'unique',
        attr: 'email',
        table: 'users',
        column: 'email',
      },
    ],
  }
}
