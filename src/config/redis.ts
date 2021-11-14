import { createClient } from 'redis';
import config from '.';

const client = createClient({
  host: config.get('redis.host'),
  port: config.get('redist.port'),
});

client.on('error', (error) => {
  console.error(error.message);
});

export default client
