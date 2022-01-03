import request from 'supertest'
import httpStatus from 'http-status'
import app from '../../server'
import { District as Repository } from './district_repository'
import database from '../../config/database'

describe('seed data', () => {
  it('insert districts', async () => {
    await Repository.Districts().insert({
      id: '12345678',
      name: 'test123',
      city_id: '12345',
      location: database.raw('ST_GeomFromText(\'POINT(107.5090974 -6.8342172)\')'),
      is_active: true,
    })
  })
})

const expectFindAll = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    city: expect.any(Object),
    location: expect.objectContaining({
      lat: expect.any(Number),
      lng: expect.any(Number),
    }),
  }),
])

const expectMeta = expect.objectContaining({
  total: expect.any(Number),
})

const expectBodyFindAll = expect.objectContaining({
  data: expectFindAll,
  meta: expectMeta,
})

const expectEmptyBodyFindAll = expect.objectContaining({
  data: [],
  meta: expectMeta,
})

describe('tests districts', () => {
  it('test success find all', async () => request(app)
    .get('/v1/districts/with-location')
    .query({
      bounds: {
        sw: '107.4312207548229,-7.044551821267334',
        ne: '107.78594184930455,-6.79575221317816',
      },
    })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodyFindAll)
    }))
})

describe('tests districts', () => {
  it('test success find all without bound sw', async () => request(app)
    .get('/v1/districts/with-location')
    .query({
      bounds: {
        ne: '107.78594184930455,-6.79575221317816',
      },
    })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectEmptyBodyFindAll)
    }))
})

describe('tests districts', () => {
  it('test success find all without bounds', async () => request(app)
    .get('/v1/districts/with-location')
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectEmptyBodyFindAll)
    }))
})
