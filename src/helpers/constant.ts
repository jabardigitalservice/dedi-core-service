import config from '../config'
import lang from '../lang'

export const isNodeEnvProduction = () => config.get('node.env') === 'production'
export const isNodeEnvDevelopment = () => config.get('node.env') === 'development'
export const isNodeEnvTest = () => config.get('node.env') === 'test'
export const convertToBoolean = (boolean: any) => ['true', 1, true].includes(boolean)
export const isCloudStorageS3 = () => config.get('cloud.storage', 's3') === 's3'
export const IsJsonString = (str: string) => {
  let isJsonString = true
  try {
    JSON.parse(str)
  } catch (e) {
    isJsonString = false
  }
  return isJsonString
}

export const UserStatus = {
  WAITING: lang.__('user.status.waiting'),
  VERIFIED: lang.__('user.status.verified'),
  REJECTED: lang.__('user.status.rejected'),
  ACTIVE: lang.__('user.status.active'),
  INACTIVE: lang.__('user.status.inactive'),
}
