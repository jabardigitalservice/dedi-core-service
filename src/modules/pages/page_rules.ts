import Joi from 'joi';

export namespace Page {
  const orderByValid = ['title', 'is_active']
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    order_by: Joi.string().valid(...orderByValid).allow(...emptyAllow),
  })

  export const store = Joi.object({
    title: Joi.string().max(70).required(),
    description: Joi.string().required(),
    is_active: Joi.boolean().required(),
    filename: Joi.string().required(),
    original_name: Joi.string().required(),
  })
}
