import request from 'supertest'
import app from '../../server'

describe('tests partners', () => {
  it('test success findAll', async () => {
    const response = await request(app)
      .get('/v1/partners')

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      data: [],
      meta: {
        last_update: null,
        current_page: 1,
        from: 0,
        last_page: 0,
        per_page: 20,
        to: 0,
        total: 0
      }
    });
  })

  it('test success findAll with requestQuery', async () => {
    const response = await request(app)
      .get('/v1/partners')
      .query({ name: 'test' })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      data: [],
      meta: {
        last_update: null,
        current_page: 1,
        from: 0,
        last_page: 0,
        per_page: 20,
        to: 0,
        total: 0
      }
    });
  })
})
