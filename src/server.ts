import config from './config'
import 'newrelic'
import { isNodeEnvTest } from './helpers/constant'
import App from './app'
import { logger } from './helpers/logger'

const { app } = new App()

if (!isNodeEnvTest()) {
  const PORT = config.get('port', 8000)
  app.listen(PORT, () => {
    logger.info(`App listening at http://0.0.0.0:${PORT}`)
  })
}

export default app
