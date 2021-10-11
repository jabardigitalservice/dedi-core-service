import request from 'supertest'
import app from '../../server'

describe('tests partners', () => {
  it('test success findAll', async () => {
    const response = await request(app)
      .get('/v1/partners')

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      data: [],
      pagination: {
        currentPage: 1,
        from: 0,
        lastPage: 0,
        perPage: 20,
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
      pagination: {
        currentPage: 1,
        from: 0,
        lastPage: 0,
        perPage: 20,
        to: 0,
        total: 0
      }
    });
  })
})
