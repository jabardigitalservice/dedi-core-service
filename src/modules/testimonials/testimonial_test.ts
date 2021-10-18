import request from 'supertest'
import app from '../../server'
import { v4 as uuidv4 } from 'uuid'
import { Testimonial as Repository } from './testimonial_repository'

describe('seed data', () => {
  it('insert a row of testimonial', async () => {
    await Repository.Testimonials().insert({
      id: uuidv4(),
      caption: 'test',
      created_by: uuidv4()
    })
  })
})

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
              user: expect.any(Object)
            })
          ]),
          meta: expect.objectContaining({
            current_page: expect.any(Number),
            from: expect.any(Number),
            last_page: expect.any(Number),
            per_page: expect.any(Number),
            to: expect.any(Number),
            total: expect.any(Number)
          })
        }))
      })
  })
})
