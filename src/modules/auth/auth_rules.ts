import Joi from 'joi';

export namespace Auth {
  export const signUp = Joi.object({
    name: Joi.string().required(),
    company: Joi.string().allow(null),
    partner_id: Joi.string().allow(null),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    password_confirm: Joi.string().valid(Joi.ref('password')).required()
  })

  export const signIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    remember: Joi.bool().allow(null)
  })

  export const refreshToken = Joi.object({
    refresh_token: Joi.string().required()
  })

  export const forgotPassword = Joi.object({
    email: Joi.string().email().required()
  })

  export const resetPassword = Joi.object({
    password: Joi.string().required(),
    password_confirm: Joi.string().valid(Joi.ref('password')).required()
  })
}
