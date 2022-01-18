import faker from 'faker'
import httpStatus from 'http-status'
import 'jest-extended'
import moment from 'moment'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import config from '../../config'
import app from '../../server'
import { Testimonial as Repository } from './testimonial_repository'

describe('seed data', () => {
  it('insert a row of testimonial', async () => {
    await Repository.Testimonials().insert({
      id: uuidv4(),
      name: faker.name.firstName(),
      description: faker.lorem.paragraph(),
      avatar: faker.image.avatar(),
      type: config.get('role.1'),
      is_active: faker.random.arrayElement([true, false]),
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

const expectResponse = expect.objectContaining({
  id: expect.any(String),
  name: expect.any(String),
  description: expect.any(String),
  avatar: expect.any(String),
  type: expect.any(String),
  village: expect.toBeOneOf([null, expect.any(Object)]),
  partner: expect.toBeOneOf([null, expect.any(Object)]),
})

const expectFindAll = expect.objectContaining({
  data: expect.arrayContaining([expectResponse]),
  meta: expectMeta,
})

const expectFindAllEmpty = expect.objectContaining({
  data: expect.arrayContaining([]),
  meta: expectMeta,
})

describe('test testimonials', () => {
  it('test success find all', async () => request(app)
    .get('/v1/testimonials')
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectFindAll)
    }))
})

describe('test testimonials', () => {
  it('test failed find all not found', async () => request(app)
    .get('/v1/testimonials')
    .query({ type: 'test' })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectFindAllEmpty)
    }))
})

describe('test testimonials', () => {
  it('test success with query find all', async () => request(app)
    .get('/v1/testimonials')
    .query({ type: 'mitra', is_active: 'true' })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectFindAll)
    }))
})
