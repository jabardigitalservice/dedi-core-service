import request from 'supertest'
import app from '../../server'

describe('test module partner', () => {
  it('findAll', async () => {
    const response = await request(app)
      .get('/v1/partners')

    expect(response.statusCode).toEqual(200)
  })

  it('findAll with requestQuery', async () => {
    const response = await request(app)
      .get('/v1/partners')
      .query({ name: 'test' })

    expect(response.statusCode).toEqual(200)
  })
})
