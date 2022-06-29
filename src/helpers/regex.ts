import config from '../config'

export const regexExtFile = new RegExp(`([a-zA-Z0-9s_\\.-:])+(${config.get('file.type')})$`)
export const regexAlphanumeric = /^[a-zA-Z0-9 .,_!@$&*?-]+$/
export const regexCodeRegion = /^[0-9.]+$/
export const regexPassword = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9&*+?.,_^|&!@$]+)$/
