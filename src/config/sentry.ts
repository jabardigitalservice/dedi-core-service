import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import config from '.'

const connection = config.get('db.connection')
const database = connection.charAt(0).toUpperCase() + connection.slice(1)

Sentry.init({
  dsn: config.get('sentry.dsn'),
  environment: config.get('node.env'),
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations[database]()
  ],
  tracesSampleRate: Number(config.get('sentry.sample.rate', 0.0))
})

export default Sentry
