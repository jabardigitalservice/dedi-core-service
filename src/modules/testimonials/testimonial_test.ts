import request from 'supertest'
import app from '../../server'

describe('testimonials', () => {
  it('/v1/testimonials --> array of testimonials', async () => {
    return request(app)
      .get('/v1/testimonials')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              caption: expect.any(String),
              type: expect.any(String),
              user: expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                avatar: expect.any(String),
              })
            })
          ])
        }))
      })
  })
})
