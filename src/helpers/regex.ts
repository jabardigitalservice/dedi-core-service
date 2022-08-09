import config from '../config'

export const regexExtFile = new RegExp(`([a-zA-Z0-9s_\\.-:])+(${config.get('file.type')})$`, 'i')
export const regexAlphanumeric = /^[a-zA-Z0-9\n .,_!@$&*?-]+$/
export const regexCodeRegion = /^[0-9.]+$/
export const regexPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9&*+?.,_^|&!@$]+)$/
export const regexPointLatitude = /^(-?\d+(\.\d+)?)$/
export const regexPointLongitude = /^\s*(-?\d+(\.\d+)?)$/
