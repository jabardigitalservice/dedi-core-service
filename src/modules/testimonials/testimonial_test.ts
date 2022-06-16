import faker from 'faker'
import httpStatus from 'http-status'
import 'jest-extended'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import config from '../../config'
import database from '../../config/database'
import { createAccessToken } from '../../middleware/jwt'
import app from '../../server'
import { Testimonial as Entity } from './testimonial_entity'

const isActive = faker.random.arrayElement(['true', 'false'])
const type = faker.random.arrayElement([config.get('role.1'), config.get('role.2')])
const name = faker.name.firstName()
const partnerId = uuidv4()
const villageId = '123456788'

describe('seed data', () => {
  it('insert a row of village', async () => {
    await database('villages').insert({
      id: villageId,
      name: 'test',
      district_id: '1',
      level: 1,
      location: database.raw("ST_GeomFromText('POINT(107.5090974 -6.8342172)')"),
      images: null,
      is_active: true,
    })
  })
})

describe('seed data', () => {
  it('insert a row of partner', async () => {
    await database('partners').insert({
      id: partnerId,
      name: 'test',
      total_village: 1,
      logo: 'https://test.com',
      website: 'https://test.com',
      created_at: new Date(),
      updated_at: new Date(),
    })
  })
})

const data = (): Entity.RequestBody => ({
  name,
  description: faker.lorem.paragraph(),
  avatar: faker.image.avatar(),
  avatar_original_name: faker.image.avatar(),
  type,
  is_active: isActive,
  partner_id: partnerId,
  village_id: villageId,
})

const dataTypeRole1 = (): Entity.RequestBody => ({ ...data(), type: config.get('role.1') })
const dataTypeRole2 = (): Entity.RequestBody => ({ ...data(), type: config.get('role.2') })

const identifier = uuidv4()

const accessToken = createAccessToken({
  identifier,
  prtnr: false,
  adm: true,
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
  avatar: {
    path: expect.any(String),
    source: expect.any(String),
    original_name: expect.toBeOneOf([null, expect.any(String)]),
  },
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

let testimonialId: string

describe('test testimonials', () => {
  it(`test success store with type ${config.get('role.1')}`, async () =>
    request(app)
      .post('/v1/testimonials')
      .send(dataTypeRole1())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.CREATED))
})

describe('test testimonials', () => {
  it(`test success store with type ${config.get('role.2')}`, async () =>
    request(app)
      .post('/v1/testimonials')
      .send(dataTypeRole2())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.CREATED))
})

describe('test testimonials', () => {
  it('test success find all', async () =>
    request(app)
      .get('/v1/testimonials')
      .expect(httpStatus.OK)
      .then((response) => {
        const [item] = response.body.data
        testimonialId = item.id
        expect(response.body).toEqual(expectFindAll)
      }))
})

describe('test testimonials', () => {
  it('test failed find all not found', async () =>
    request(app)
      .get('/v1/testimonials')
      .query({ type: 'test' })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectFindAllEmpty)
      }))
})

describe('test testimonials', () => {
  it('test success with query find all', async () =>
    request(app)
      .get('/v1/testimonials')
      .query({ type, is_active: isActive, q: name })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectFindAll)
      }))
})

describe('test testimonials', () => {
  it('test success update', async () =>
    request(app)
      .put(`/v1/testimonials/${testimonialId}`)
      .send(dataTypeRole2())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('test testimonials', () => {
  it('test failed update not found', async () =>
    request(app)
      .put('/v1/testimonials/9999')
      .send(dataTypeRole2())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})

describe('test testimonials', () => {
  it('test success find by id', async () =>
    request(app)
      .get(`/v1/testimonials/${testimonialId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('test testimonials', () => {
  it('test failed find by id not found', async () =>
    request(app)
      .get('/v1/testimonials/9999')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})

describe('test testimonials', () => {
  it('test failed destroy not found', async () =>
    request(app)
      .delete('/v1/testimonials/9999')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})

describe('test testimonials', () => {
  it('test success destroy', async () =>
    request(app)
      .delete(`/v1/testimonials/${testimonialId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})
