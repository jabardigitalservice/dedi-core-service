import lang from 'i18n'
import path from 'path'
import config from '../config'

lang.configure({
  locales: ['en', 'id'],
  directory: path.join(__dirname, 'locales'),
  register: global,
  defaultLocale: config.get('default.locale', 'en')
})

export default lang
