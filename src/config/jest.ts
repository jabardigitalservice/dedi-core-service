import redis from './redis'

global.beforeEach(() => {
  redis.flushall()
})

global.afterAll(async () => {
  redis.flushall()

  await new Promise<void>((resolve) => {
    redis.quit(() => resolve())
  })
})
