import Joi from 'joi';

export namespace Partner {
  export const findAll = Joi.object({
    name: Joi.string().allow(null),
    perPage: Joi.number().allow(null),
    page: Joi.number().allow(null)
  })
}
