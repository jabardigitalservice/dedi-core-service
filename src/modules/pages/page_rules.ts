import Joi from 'joi';
import { ValidationWithDB } from '../../helpers/validator';

export namespace Page {
  const orderByValid = ['title', 'is_active']
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    order_by: Joi.string().valid(...orderByValid).allow(...emptyAllow),
    is_active: Joi.boolean().allow(...emptyAllow),
  })

  const validate = Joi.object({
    title: Joi.string().max(70).required(),
    description: Joi.string().required(),
    is_active: Joi.boolean().required(),
    filename: Joi.string().max(255).required(),
    original_name: Joi.string().max(255).required(),
  })

  export const store = validate
  export const update = validate

  const validateWithDB: ValidationWithDB = {
    title: [
      {
        type: 'unique', attr: 'title', table: 'pages', column: 'title', params: 'id',
      },
    ],
  }

  export const storeWithDB = validateWithDB
  export const updateWithDB = validateWithDB
}
