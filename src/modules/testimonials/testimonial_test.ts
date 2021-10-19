import request from 'supertest'
import app from '../../server'
import { v4 as uuidv4 } from 'uuid'
import { Testimonial as Repository } from './testimonial_repository'

describe('seed data', () => {
  const user_id = uuidv4()

  it('insert a row of testimonial', async () => {
    await Repository.Testimonials().insert({
      id: uuidv4(),
      caption: 'test',
      created_by: user_id
    })
  })

  it('insert a row of user', async () => {
    await Repository.Users().insert({
      id: user_id,
      name: 'test',
      description: 'test',
      avatar: 'test.svg',
      type: 'mitra'
    })
  })
})

const expectMeta = expect.objectContaining({
  current_page: expect.any(Number),
  from: expect.any(Number),
  last_page: expect.any(Number),
  per_page: expect.any(Number),
  to: expect.any(Number),
  total: expect.any(Number)
})

const expectResponseBody = expect.objectContaining({
  data: expect.arrayContaining([
    expect.objectContaining({
      id: expect.any(String),
      caption: expect.any(String),
      user: expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        avatar: expect.any(String),
        type: expect.any(String)
      })
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
        expect(response.body).toEqual(expectResponseBody)
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

  it('/v1/testimonials?query --> data testimonials with spesific user type', async () => {
    return request(app)
      .get('/v1/testimonials')
      .query({ type: 'mitra' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expectResponseBody)
      })
  })
})
