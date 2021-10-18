import redis from '../config/redis';

global.beforeEach(async () => {
  await redis.flushall()
});

global.afterAll(async () => {
  await redis.flushall()
})
