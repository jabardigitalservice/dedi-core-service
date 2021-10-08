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

    errors.isError ? res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.rules }) : next()
  }
}

export const validateError = (details: Joi.ValidationErrorItem[]) => {
  const isError = false
  const rules: any = {}

  for (const i of details) {
    if (i.type === 'object.unknown') continue
    rules[i.context.key] = [message(i.type, i.context.label)]
  }

  return {
    isError,
    rules
  }
}

export const message = (type: string, label: string) => {
  const rule = type.split('.')[1]

  return lang.__(`validation.${rule}`, { attribute: label })
}
