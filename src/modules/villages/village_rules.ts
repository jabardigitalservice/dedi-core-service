import Joi from 'joi'
import { regexAlphanumeric, regexCodeRegion, regexExtFile, regexPoint } from '../../helpers/regex'
import { ValidationWithDB } from '../../helpers/validator'

export namespace VillageRules {
  const orderByValid = ['villages.name']
  const emptyAllow = ['', null]

  export const listWithLocation = Joi.object({
    order_by: Joi.string()
      .valid(...orderByValid)
      .allow(...emptyAllow),
  })

  const validate = Joi.object({
    id: Joi.string().min(13).max(14).regex(regexCodeRegion).required(),
    name: Joi.string().min(3).max(100).required().regex(regexAlphanumeric).trim(),
    city_id: Joi.string().min(5).max(5).regex(regexCodeRegion).required(),
    district_id: Joi.string().min(8).max(8).regex(regexCodeRegion).required(),
    level: Joi.number().valid(1, 2, 3, 4, null),
    longitude: Joi.string().regex(regexPoint).required(),
    latitude: Joi.string().regex(regexPoint).required(),
  })

  export const store = validate
  export const update = validate

  const validateWithDB: ValidationWithDB = {
    id: [
      {
        type: 'unique',
        attr: 'id',
        table: 'villages',
        column: 'id',
        params: 'id',
      },
    ],
  }

  export const storeWithDB = validateWithDB
  export const updateWithDB = validateWithDB
}
