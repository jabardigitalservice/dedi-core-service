import request from 'supertest'
import httpStatus from 'http-status'
import app from '../../server'
import { Village as Repository } from './village_repository'
import database from '../../config/database'

const expectMetaFindAll = expect.objectContaining({
  total: expect.any(Number),
})

const expectMetaFindById = expect.any(Object)

const expectFindAll = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    level: expect.any(Number),
    city: expect.any(Object),
    category: expect.any(Object),
    location: expect.objectContaining({
      lat: expect.any(Number),
      lng: expect.any(Number),
    }),
    images: expect.any(Array),
  }),
])

const expectFindById = expect.objectContaining({
  id: expect.any(String),
  name: expect.any(String),
  level: expect.any(Number),
  city: expect.any(Object),
  category: expect.any(Object),
})

const expectBodyFindById = expect.objectContaining({
  data: expectFindById,
  meta: expectMetaFindById,
})

const expectBodyFindAll = expect.objectContaining({
  data: expectFindAll,
  meta: expectMetaFindAll,
})

const expectBodyFindAllEmptyData = expect.objectContaining({
  data: [],
  meta: expectMetaFindAll,
})

describe('seed data', () => {
  it('insert villages', async () => {
    await Repository.Villages().insert({
      id: '123456785',
      name: 'test',
      district_id: '1',
      level: 1,
      location: database.raw('ST_GeomFromText(\'POINT(106.8207875 -6.4605558)\')'),
      images: null,
      is_active: true,
      updated_at: new Date(),
    })
  })
})

describe('tests villages', () => {
  it('test success find all', async () => request(app)
    .get('/v1/villages/list-with-location')
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodyFindAll)
    }))
})

describe('tests villages', () => {
  it('test success with query name find all', async () => request(app)
    .get('/v1/villages/list-with-location')
    .query({ name: 'test' })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodyFindAll)
    }))
})

describe('tests villages', () => {
  it('test success with query level find all', async () => request(app)
    .get('/v1/villages/list-with-location')
    .query({ level: 1 })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodyFindAll)
    }))
})

describe('tests villages', () => {
  it('test success with location find all', async () => request(app)
    .get('/v1/villages/with-location')
    .query({
      bounds: {
        ne: '106.8207875, -6.4605558',
        sw: '106.8207875, -6.4605558',
      },
    })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodyFindAllEmptyData)
    }))
})

describe('tests villages', () => {
  it('test success without query bounds', async () => request(app)
    .get('/v1/villages/with-location')
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodyFindAllEmptyData)
    }))
})

describe('tests villages', () => {
  it('test failed not found find by id', async () => request(app)
    .get('/v1/villages/34543234565435654')
    .expect(httpStatus.NOT_FOUND))
})

describe('tests villages', () => {
  it('responds success', async () => request(app)
    .get('/v1/villages/123456785')
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodyFindById)
    }))
})
