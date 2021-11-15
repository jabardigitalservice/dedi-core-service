import httpStatus from 'http-status'
import database from '../config/database'
import { HttpError } from '../handler/exception'
import { message } from './validator'

interface rulesInterface {
  isError: boolean,
  errors?: {
    [key: string]: string[]
  }
}

interface propertyData {
  table: string
  key: string
  value: string
  primaryKey?: string,
  primaryKeyValue?: string | number,
  isWhereNullDeletedAt?: boolean
}

const rules: rulesInterface = {
  isError: false,
}

const Data = (data: propertyData) => {
  const query = database(data.table).where(data.key, data.value)
  if (data.primaryKey && data.primaryKeyValue) query.whereNot(data.primaryKey, data.primaryKeyValue)
  if (data.isWhereNullDeletedAt) query.whereNull('deleted_at')
  return query.first()
}

export const uniqueRule = async (data: propertyData): Promise<rulesInterface> => {
  const item: any = await Data(data)

  if (item) {
    rules.isError = true
    rules.errors = {
      [data.key]: [message('unique', data.key)],
    }
  } else rules.isError = false

  return rules
}

export const existsRule = async (data: propertyData): Promise<rulesInterface> => {
  const item: any = await Data(data)

  if (!item) {
    rules.isError = true
    rules.errors = {
      [data.key]: [message('exists', data.key)],
    }
  } else rules.isError = false

  return rules
}

export const checkError = (rule: rulesInterface) => {
  if (rule.isError) {
    throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, JSON.stringify(rule.errors), true)
  }
}
