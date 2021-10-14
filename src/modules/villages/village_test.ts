import request from 'supertest'
import app from '../../server'

describe('tests villages', () => {
  it('test success findAll with location ', async () => {
    const response = await request(app).get('/v1/villages/list-with-location')

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      data: [],
      meta: {
        total: 0
      }
    });
  })
})

describe('test find by id', () => {
  it('responds with 404 given unknown id', async () => {
    const response = await request(app).get('/v1/villages/34543234565435654')

    expect(response.statusCode).toEqual(404)
  })
})
