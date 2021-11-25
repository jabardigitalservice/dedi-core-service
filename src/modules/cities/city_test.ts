import request from 'supertest'
import app from '../../server'
import { City as Repository } from './city_repository'
import database from '../../config/database'

describe('seed data', () => {
  it('insert cities', async () => {
    await Repository.Cities().insert({
      id: '12345',
      name: 'test123',
      location: database.raw('ST_GeomFromText(\'POINT(106.8207875 -6.4605558)\')'),
      is_active: true,
    })
  })
})

const expectBodyFindAll = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    location: expect.objectContaining({
      lat: expect.any(Number),
      lng: expect.any(Number),
    }),
  }),
])

describe('tests cities', () => {
  it('test success findAll with location ', async () => request(app)
    .get('/v1/cities/with-location')
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

describe('tests cities', () => {
  it('test success findAll with location filter bounds', async () => request(app)
    .get('/v1/cities/with-location')
    .query({
      bounds: {
        ne: '106.8207875, -6.4605558',
        sw: '106.8207875, -6.4605558',
      },
    })
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual(expect.objectContaining({
        data: [],
        meta: expect.objectContaining({
          total: expect.any(Number),
        }),
      }))
    }))
})
