import httpStatus from 'http-status'
import Joi, { Schema } from 'joi'
import lang from '../lang'
import { Request, Response, NextFunction } from 'express'

export const validate = (schema: Schema, property: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false })

    if (!error) return next()

    const { details } = error
    const errors = validateError(details)

    Object.keys(errors).length >= 0 ? res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ errors }) : next()
  }
}

export const validateError = (details: Joi.ValidationErrorItem[]) => {
  const rules: any = {}

  for (const item of details) {
    if (item.type === 'object.unknown') continue
    rules[item.context.key] = [message(item.type, item.context.label)]
  }

  return rules
}

export const message = (type: string, label: string) => {
  const rule = type.split('.')[1]

  return lang.__(`validation.${rule}`, { attribute: label })
}
