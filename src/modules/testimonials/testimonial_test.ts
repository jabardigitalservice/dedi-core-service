import moment from 'moment'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import app from '../../server'
import { Testimonial as Repository } from './testimonial_repository'

describe('seed data', () => {
  it('insert a row of testimonial', async () => {
    await Repository.Testimonials().insert({
      id: uuidv4(),
      name: 'test',
      description: 'test',
      avatar: 'test.svg',
      type: 'mitra',
      is_active: true,
      created_at: moment().subtract({ seconds: 1 }).toDate(),
      created_by: uuidv4(),
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
})

describe('filter testimonials', () => {
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
