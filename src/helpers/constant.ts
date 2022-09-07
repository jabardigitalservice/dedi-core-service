import config from '../config'

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

export enum UserStatus {
  WAITING = 'Menunggu Verifikasi',
  VERIFIED = 'Terverifikasi',
  REJECTED = 'Ditolak',
  ACTIVE = 'Aktif',
  INACTIVE = 'Nonaktif',
}
