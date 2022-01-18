import Joi from 'joi';

export namespace Testimonial {
  const orderByValid = ['type', 'is_active']
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    order_by: Joi.string().valid(...orderByValid).allow(...emptyAllow),
    is_active: Joi.boolean().allow(...emptyAllow),
  })
}
