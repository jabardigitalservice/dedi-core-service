import redis from '../config/redis';

global.beforeEach(() => {
  redis.flushall();
});

global.afterAll(() => {
  redis.flushall();
})
