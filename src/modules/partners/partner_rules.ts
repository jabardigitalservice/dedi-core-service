import Joi from 'joi';

export namespace Partner {
  export const findAll = Joi.object({
    name: Joi.string().allow(null),
    per_page: Joi.number().allow(null),
    current_page: Joi.number().allow(null)
  })
}
