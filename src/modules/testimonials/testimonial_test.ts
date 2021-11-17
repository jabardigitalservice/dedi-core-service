import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import app from '../../server'
import { Testimonial as Repository } from './testimonial_repository'

const timestamp = new Date()
timestamp.setMilliseconds(0)

const ONE_MILISECOND = 1
const ONE_SECOND = 1000 * ONE_MILISECOND
const ONE_MINUTE = 60 * ONE_SECOND

const minuteBeforeTimestamp = (minute, timestamp) => new Date(timestamp - minute * ONE_MINUTE)

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
      created_at: minuteBeforeTimestamp(1, timestamp),
      created_by: user_id,
    })
  })
})

const expectMeta = expect.objectContaining({
  current_page: expect.any(Number),
  from: expect.any(Number),
  last_page: expect.any(Number),
  per_page: expect.any(Number),
  to: expect.any(Number),
  total: expect.any(Number),
})

const expectData = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    description: expect.any(String),
    avatar: expect.any(String),
    type: expect.any(String),
  }),
])

describe('testimonials', () => {
  it('/v1/testimonials --> data testimonials', async () => request(app)
    .get('/v1/testimonials')
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(expect.objectContaining({
        data: expectData,
        meta: expectMeta,
      }))
    }))
})

describe('filter testimonials', () => {
  it('/v1/testimonials?query --> empty data testimonial if type not found', async () => request(app)
    .get('/v1/testimonials')
    .query({ type: 'test' })
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(expect.objectContaining({
        data: expect.any(Array),
        meta: expectMeta,
      }))
    }))

  it('/v1/testimonials?query --> data testimonials with spesific type', async () => request(app)
    .get('/v1/testimonials')
    .query({ type: 'mitra' })
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(expect.objectContaining({
        data: expectData,
        meta: expectMeta,
      }))
    }))
})

describe('filter testimonials using cursor', () => {
  it('/v1/testimonialsUsingCursor?query --> empty data testimonial if type not found', async () => request(app)
    .get('/v1/testimonialsUsingCursor')
    .query({ type: 'test' })
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(expect.objectContaining({
        data: expect.any(Array),
        meta: {
          next_page: null,
          per_page: expect.any(Number),
        },
      }))
    }))

  it('/v1/testimonialsUsingCursor?query --> data testimonials with spesific type', async () => request(app)
    .get('/v1/testimonialsUsingCursor')
    .query({ type: 'mitra', per_page: 3 })
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(expect.objectContaining({
        data: expectData,
        meta: {
          next_page: expect.any(String),
          per_page: expect.any(Number),
        },
      }))
    }))
})
