import request from 'supertest'
import app from '../../server'
import { v4 as uuidv4 } from 'uuid'
import { Testimonial as Repository } from './testimonial_repository'

describe('seed data', () => {
  const user_id = uuidv4()

  it('insert a row of testimonial', async () => {
    await Repository.Testimonials().insert({
      id: uuidv4(),
      name: 'test',
      description: 'test',
      avatar: 'test.svg',
      type: 'mitra',
      is_active: true,
      created_by: user_id
    })
  })
})

const expectMeta = expect.objectContaining({
  current_page: expect.any(Number),
  last_page: expect.any(Number),
  per_page: expect.any(Number),
  to: expect.any(Number),
  total: expect.any(Number)
})

const expectBody = expect.objectContaining({
  data: expect.arrayContaining([
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      avatar: expect.any(String),
      type: expect.any(String)
    })
  ]),
  meta: expectMeta
})

describe('testimonials', () => {
  it('/v1/testimonials --> data testimonials', async () => {
    return request(app)
      .get('/v1/testimonials')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expectBody)
      })
  })
})

describe('filter testimonials', () => {
  it('/v1/testimonials?query --> empty data testimonial if user type not found', async () => {
    return request(app)
      .get('/v1/testimonials')
      .query({ type: 'test' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          data: expect.any(Array),
          meta: expectMeta
        }))
      })
  })

  it('/v1/testimonials?query --> data testimonials with spesific type', async () => {
    return request(app)
      .get('/v1/testimonials')
      .query({ type: 'mitra' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expectBody)
      })
  })
})
