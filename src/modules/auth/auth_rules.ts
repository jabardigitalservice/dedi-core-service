import Joi from 'joi';
import { ValidationWithDB } from '../../helpers/validator';

export namespace Auth {

  const regexPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9&*+?.,^|&]+)$/

  const emptyAllow = ['', null]

  const password = () => Joi.string().min(6).max(72).regex(regexPassword)

  const rulesPassword = {
    password: password().required(),
    password_confirm: password().valid(Joi.ref('password')).required(),
  }

  const email = Joi.string().email().max(150).required()

  export const signUp = Joi.object({
    name: Joi.string().max(100).required(),
    company: Joi.string().allow(...emptyAllow),
    partner_id: Joi.string().allow(...emptyAllow),
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
        type: 'unique', attr: 'email', table: 'users', column: 'email',
      },
    ],
  }
}
