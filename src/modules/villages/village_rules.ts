import Joi from 'joi';
import { ValidationWithDB } from '../../helpers/validator';

export namespace Village {
  export const questionnaire = Joi.object({
    id: Joi.string().max(14).required(),
    level: Joi.number().min(1).max(4).required(),
    properties: Joi.object().min(1).required(),
  })

  export const questionnaireWithDB: ValidationWithDB = {
    email: [
      {
        type: 'exists', attr: 'id', table: 'villages', column: 'id',
      },
    ],
  }
}
