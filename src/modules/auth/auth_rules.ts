import Joi from 'joi';

export namespace Auth {

  const regexPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/

  const password = {
    password: Joi.string().regex(regexPassword).required(),
    password_confirm: Joi.string().regex(regexPassword).valid(Joi.ref('password')).required()
  }

  const email = Joi.string().email().required()

  export const signUp = Joi.object({
    name: Joi.string().required(),
    company: Joi.string().allow(null),
    partner_id: Joi.string().allow(null),
    email,
    ...password
  })

  export const signIn = Joi.object({
    email,
    password: Joi.string().required(),
    remember: Joi.bool().allow(null)
  })

  export const refreshToken = Joi.object({
    refresh_token: Joi.string().required()
  })

  export const forgotPassword = Joi.object({
    email
  })

  export const resetPassword = Joi.object({
    ...password
  })
}
