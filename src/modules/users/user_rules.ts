import Joi from 'joi';

export namespace User {
  const orderByValid = ['name', 'is_active', 'email']
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    order_by: Joi.string().valid(...orderByValid).allow(...emptyAllow),
    is_admin: Joi.boolean().allow(...emptyAllow),
    is_active: Joi.boolean().allow(...emptyAllow),
  })
}
