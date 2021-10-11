import config from 'env-dot-prop'
import dotEnv from 'dotenv'

dotEnv.config({
  path: '../../.env'
})

if (!config.get('node.env')) dotEnv.config()

const decodeBase64 = (key = '') => {
  return Buffer.from(key, 'base64').toString().replace(/\\n/g, '\n')
}

// override config
config.set('jwt.secret', decodeBase64(config.get('jwt.secret', 'test')))
config.set('jwt.public', decodeBase64(config.get('jwt.public', 'test')))
config.set('jwt.algorithm', config.get('jwt.algorithm', 'HS256'))
config.set('jwt.ttl', config.get('jwt.ttl', 36000))
config.set('db.connection', config.get('db.connection', 'mysql'))

export default config
