import config from '../config'

export const regexExtFile = new RegExp(`([a-zA-Z0-9s_\\.-:])+(${config.get('file.type')})$`)
export const regexAlphanumeric = /^[a-zA-Z0-9 .,-]+$/
export const regexCodeRegion = /^[0-9. ]+$/
