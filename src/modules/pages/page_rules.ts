import Joi from 'joi'
import { regexAlphanumeric, regexExtFile } from '../../helpers/regex'
import { ValidationWithDB } from '../../helpers/validator'

export namespace PageRules {
  const orderByValid = ['title', 'is_active', 'updated_at', 'order', 'created_at']
  const emptyAllow = ['', null]

  export const findAll = Joi.object({
    order_by: Joi.string()
      .valid(...orderByValid)
      .allow(...emptyAllow),
    is_active: Joi.boolean().allow(...emptyAllow),
  })

  const validate = Joi.object({
    title: Joi.string().regex(regexAlphanumeric).trim().max(70).required(),
    link: Joi.string().uri().max(255).required(),
    order: Joi.number().required(),
    is_active: Joi.boolean().required(),
    image: Joi.string().regex(regexExtFile).max(255).required(),
    image_original_name: Joi.string().regex(regexExtFile).max(255).required(),
  })

  export const store = validate
  export const update = validate

  const validateWithDB: ValidationWithDB = {
    title: [
      {
        type: 'unique',
        attr: 'title',
        table: 'pages',
        column: 'title',
        params: 'id',
      },
    ],
    image: [
      {
        type: 'unique',
        attr: 'image',
        table: 'pages',
        column: 'image',
        params: 'id',
      },
    ],
  }

  export const storeWithDB = validateWithDB
  export const updateWithDB = validateWithDB
}
