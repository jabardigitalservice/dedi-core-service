import httpStatus from 'http-status'
import Joi, { Schema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import lang from '../lang'
import rules from './rules'
import database from '../config/database'

interface ValidationWithDB {
  [key: string]: string
}

const isTypeUnique = (type: string) => type === 'unique'

const message = (type: string, label: string, limit?: string, valids?: string[]) => {
  const valid = valids?.filter((e) => e)?.join(', ')

  if (label === 'password_confirm' && type === 'any.only') type = `${type}.confirmed`

  return lang.__(`validation.${type}`, { attribute: label, limit, valid })
}

const validateError = (details: Joi.ValidationErrorItem[]) => {
  const rules: any = {}

  for (const item of details) {
    const { context, type, path } = item
    const key = path.join('.')
    const label = path.join(' ')

    if (type === 'object.unknown') continue

    rules[key] = message(type, label, context?.limit, context?.valids)
  }

  return rules
}

export const validate = (
  schema: Schema,
  property: string = 'body',
) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req[property], { abortEarly: false })

  if (!error) return next()

  const { details } = error
  const errors = validateError(details)

  Object.keys(errors).length ? res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ errors }) : next()
}

const Query = (table: string, column: string, value: string, deletedAt: string) => {
  const query = database(table).select(column).where(column, value)
  if (deletedAt === 'deleted_at') query.whereNull(deletedAt)
  return query
}

const validateWithDBError = async (req: Request, Key: string, Value: string) => {
  let error: string = null
  const [type, property] = Value.split(':')
  const [table, column, primaryKey, deletedAt] = property.split(',')
  const value: string = req.body[Key]

  const primaryKeyValue = req.params[primaryKey] || null

  const query = Query(table, column, value, deletedAt)
  if (isTypeUnique(type) && primaryKeyValue) query.whereNot(primaryKey, primaryKeyValue)
  const row: any = await query.first()

  const isError: boolean = rules[type](row)

  if (isError) {
    error = message(type, Key)
  }

  return {
    error,
    type,
  }
}

export const validateWithDB = (
  validation: ValidationWithDB,
) => async (req: Request, res: Response, next: NextFunction) => {
  const errors: any = {}
  const rules = Object.entries(validation)
  for (const [Key, Value] of rules) {
    const { error, type } = await validateWithDBError(req, Key, Value)
    if (error) errors[Key] = message(type, Key)
  }

  Object.keys(errors).length ? res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ errors }) : next()
}
