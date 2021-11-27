import config from 'env-dot-prop'
import dotEnv from 'dotenv'

dotEnv.config({
  path: '../../.env',
})

if (!config.get('node.env')) dotEnv.config()

const decodeBase64 = (key = '') => Buffer.from(key, 'base64').toString().replace(/\\n/g, '\n')

// override config
config.set('jwt.secret', decodeBase64(config.get('jwt.secret', 'test')))
config.set('jwt.public', decodeBase64(config.get('jwt.public', 'test')))
config.set('jwt.algorithm', config.get('jwt.algorithm', 'HS256'))
config.set('jwt.ttl', config.get('jwt.ttl', 36000))

config.set('jwt.type', config.get('jwt.type', 'Bearer'))

config.set('jwt.refresh.secret', decodeBase64(config.get('jwt.refresh.secret', 'test')))
config.set('jwt.refresh.public', decodeBase64(config.get('jwt.refresh.public', 'test')))
config.set('jwt.refresh.algorithm', config.get('jwt.refresh.algorithm', 'HS256'))
config.set('jwt.refresh.ttl', config.get('jwt.refresh.ttl', 36000))

config.set('db.connection', config.get('db.connection', 'mysql'))

config.set('roles.0', config.get('roles.0', 'roles.0'))
config.set('roles.1', config.get('roles.1', 'roles.1'))
config.set('roles.2', config.get('roles.2', 'roles.2'))

config.set('tmp', 'tmp')

export default config
