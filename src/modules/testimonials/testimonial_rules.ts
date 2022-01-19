import Joi from 'joi';
import config from '../../config';
import { ValidationWithDB } from '../../helpers/validator';

export namespace Testimonial {
  const orderByValid = ['type', 'is_active']
  const emptyAllow = ['', null]
  const typeValid = [config.get('role.1'), config.get('role.2')]

  export const findAll = Joi.object({
    order_by: Joi.string().valid(...orderByValid).allow(...emptyAllow),
    is_active: Joi.boolean().allow(...emptyAllow),
  })

  const validate = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().required(),
    avatar: Joi.string().uri().required(),
    type: Joi.string().valid(...typeValid).required(),
    is_active: Joi.boolean().required(),
    partner_id: Joi.alternatives().conditional('type', { is: config.get('role.1'), then: Joi.string().max(36).required(), otherwise: Joi.optional() }),
    village_id: Joi.alternatives().conditional('type', { is: config.get('role.2'), then: Joi.string().max(11).required(), otherwise: Joi.optional() }),
  })

  export const store = validate

  const validateWithDB: ValidationWithDB = {
    partner_id: [
      {
        type: 'exists', attr: 'partner_id', table: 'partners', column: 'id',
      },
    ],
    village_id: [
      {
        type: 'exists', attr: 'village_id', table: 'villages', column: 'id',
      },
    ],
  }

  export const storeWithDB = validateWithDB
}
