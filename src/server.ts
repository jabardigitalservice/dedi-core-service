import config from './config'
import 'newrelic'
import { isNodeEnvTest } from './helpers/constant'
import App from './app'

const { app } = new App()

if (!isNodeEnvTest()) {
  const PORT = config.get('port', 8000)
  app.listen(PORT, () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
  })
}

export default app
