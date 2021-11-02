import request from 'supertest'
import app from '../../server'
import { Village as Repository } from './village_repository'
import KnexPostgis from 'knex-postgis'
import database from '../../config/database'
const st = KnexPostgis(database);

describe('seed data', () => {
  it('insert villages', async () => {
    await Repository.Villages().insert({
      id: '123456785',
      name: 'test',
      district_id: '1',
      level: 1,
      location: st.geomFromText('Point(0 0)'),
      images: null,
      is_active: true,
    })
  })
})

const expectBodyFindAll = expect.arrayContaining([
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
    images: expect.any(Array)
  })
])

describe('tests villages', () => {
  it('test success findAll with location ', async () => {
    return request(app)
      .get('/v1/villages/list-with-location')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          data: expectBodyFindAll,
          meta: expect.objectContaining({
            total: expect.any(Number)
          })
        }))
      })
  })
})

describe('tests villages', () => {
  it('test success findAll with location filter', async () => {
    return request(app)
      .get('/v1/villages/list-with-location')
      .query({ name: 'test', level: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          data: expectBodyFindAll,
          meta: expect.objectContaining({
            total: expect.any(Number)
          })
        }))
      })
  })
})

describe('test find by id', () => {
  it('responds with 404 given unknown id', async () => {
    return request(app)
      .get('/v1/villages/34543234565435654')
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          error: expect.any(String)
        }))
      })
  })
})

describe('test find by id', () => {
  it('responds success', async () => {
    return request(app)
      .get('/v1/villages/123456785')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          data: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            level: expect.any(Number),
            city: expect.any(Object),
            category: expect.any(Object),
          }),
          meta: expect.any(Object)
        }))
      })
  })
})
