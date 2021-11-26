import request from 'supertest'
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

const expectBodyFindAll = expect.arrayContaining([
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

describe('tests districts', () => {
  it('test success with location', async () => request(app)
    .get('/v1/districts/with-location')
    .query({
      bounds: {
        sw: '107.4312207548229,-7.044551821267334',
        ne: '107.78594184930455,-6.79575221317816',
      },
    })
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(expect.objectContaining({
        data: expectBodyFindAll,
        meta: expect.objectContaining({
          total: expect.any(Number),
        }),
      }))
    }))
})
