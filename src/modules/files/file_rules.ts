import Joi from 'joi';

export namespace File {
  export const destroy = Joi.object({
    source: Joi.string().required(),
  })
}
