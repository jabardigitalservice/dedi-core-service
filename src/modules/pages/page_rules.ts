import Joi from 'joi';

export namespace Page {
  const orderByValid = ['title', 'is_active']
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    order_by: Joi.string().valid(...orderByValid).allow(...emptyAllow),
  })
}