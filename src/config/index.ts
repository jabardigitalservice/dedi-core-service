import config from 'env-dot-prop'
import dotEnv from 'dotenv'

dotEnv.config({
  path: '../../.env',
})

if (!config.get('node.env')) dotEnv.config()

const decodeBase64 = (key = '') => Buffer.from(key, 'base64').toString()

// override config
config.set('jwt.secret', decodeBase64(config.get('jwt.secret', 'test')).replace(/\\n/g, '\n'))
config.set('jwt.public', decodeBase64(config.get('jwt.public', 'test')).replace(/\\n/g, '\n'))
config.set('jwt.algorithm', config.get('jwt.algorithm', 'HS256'))
config.set('jwt.ttl', config.get('jwt.ttl', 36000))

config.set('jwt.type', config.get('jwt.type', 'Bearer'))

config.set(
  'jwt.refresh.secret',
  decodeBase64(config.get('jwt.refresh.secret', 'test')).replace(/\\n/g, '\n')
)
config.set(
  'jwt.refresh.public',
  decodeBase64(config.get('jwt.refresh.public', 'test')).replace(/\\n/g, '\n')
)
config.set('jwt.refresh.algorithm', config.get('jwt.refresh.algorithm', 'HS256'))
config.set('jwt.refresh.ttl', config.get('jwt.refresh.ttl', 36000))

config.set('db.connection', config.get('db.connection', 'mysql'))

config.set('role.0', config.get('role.0', 'role.0'))
config.set('role.1', config.get('role.1', 'role.1'))
config.set('role.2', config.get('role.2', 'role.2'))

config.set('gcloud.key', decodeBase64(config.get('gcloud.key')))

config.set('file.type', config.get('file.type', 'jpg|png|svg|jpeg|pdf'))
config.set('file.max', config.get('file.max', 10)) // Unit MB

config.set('filesystem.driver', config.get('filesystem.driver', 'gcs'))

export default config
