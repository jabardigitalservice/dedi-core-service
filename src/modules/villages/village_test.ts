import request from 'supertest'
import app from '../../server'

describe('tests villages', () => {
  it('test success findAll with location ', async () => {
    const response = await request(app).get('/v1/villages/list-with-location')

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      data: []
    });
  })
})
