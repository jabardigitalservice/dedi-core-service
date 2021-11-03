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

const rules: rulesInterface = {
  isError: false
}

const data = (table: string, key: string, value: string, primaryKey?: string, primaryKeyValue?: string | number) => {
  const query = database(table).where(key, value)
  if (primaryKey && primaryKeyValue) query.whereNot(primaryKey, primaryKeyValue)
  return query.first()
}

export const uniqueRule = async (table: string, key: string, value: string, primaryKey?: string, primaryKeyValue?: string | number): Promise<rulesInterface> => {
  const item: any = await data(table, key, value, primaryKey, primaryKeyValue)

  if (item) {
    rules.isError = true
    rules.errors = {
      [key]: [message('.unique', key)]
    }
  } else rules.isError = false

  return rules
}

export const existsRule = async (table: string, key: string, value: string): Promise<rulesInterface> => {
  const item: any = await data(table, key, value)

  if (!item) {
    rules.isError = true
    rules.errors = {
      [key]: [message('.exists', key)]
    }
  } else rules.isError = false

  return rules
}

export const checkError = (rule: rulesInterface) => {
  if (rule.isError) throw new HttpError(httpStatus.UNPROCESSABLE_ENTITY, JSON.stringify(rule.errors), true)
}


