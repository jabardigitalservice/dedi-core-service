import request from 'supertest'
import redis from '../../config/redis'
import app from '../../server'

describe('tests villages', () => {
  it('test success findAll with location ', async () => {
    await redis.del('find_all_with_location')
    return request(app)
      .get('/v1/villages/list-with-location')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          data: expect.any(Array),
          meta: expect.objectContaining({
            total: expect.any(Number)
          })
        }))
      })
  })
})

describe('test find by id', () => {
  it('responds with 404 given unknown id', async () => {
    return request(app)
      .get('/v1/villages/34543234565435654')
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          error: expect.any(String)
        }))
      })
  })
})
