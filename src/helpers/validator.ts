import httpStatus from 'http-status'
import Joi, { Schema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import lang from '../lang'
import rules from './rules'
import database from '../config/database'

interface PropertyWithDB {
  attr: string
  type: string
  table: string
  column: string
  params?: string
  isDeletedAt?: boolean
}
export interface ValidationWithDB {
  [key: string]: PropertyWithDB[]
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

const Query = async (rule: PropertyWithDB, value: string, primaryKeyValue?: string) => {
  const query = database(rule.table).select(rule.column).where(rule.column, value)

  if (rule.isDeletedAt) query.whereNull('deleted_at')

  if (isTypeUnique(rule.type) && primaryKeyValue) query.whereNot(rule.params, primaryKeyValue)

  return query.first()
}

const validateWithDBError = async (req: Request, rule: PropertyWithDB): Promise<string> => {
  const value: string = req.body[rule.attr]
  const primaryKeyValue = req.params[rule.params] || null

  const row: any = await Query(rule, value, primaryKeyValue)

  const isError: boolean = rules[rule.type](row)

  return isError ? message(rule.type, rule.attr) : null
}

const getErrorWithDB = async (req: Request, rules: PropertyWithDB[]) => {
  let message: string
  for (const rule of rules) {
    const error = await validateWithDBError(req, rule)
    if (error) message = error
  }
  return message
}

const validateErrorWithDB = async (req: Request, validation: ValidationWithDB) => {
  const errors: any = {}
  for (const [key, rules] of Object.entries(validation)) {
    const error = await getErrorWithDB(req, rules)
    if (error) errors[key] = error
  }
  return errors
}

export const validateWithDB = (
  validation: ValidationWithDB,
) => async (req: Request, res: Response, next: NextFunction) => {
  const errors = await validateErrorWithDB(req, validation)
  Object.keys(errors).length ? res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ errors }) : next()
}
