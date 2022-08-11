import faker from 'faker'
import 'jest-extended'
import request from 'supertest'
import httpStatus from 'http-status'
import { v4 as uuidv4 } from 'uuid'
import app from '../../server'
import database from '../../config/database'
import { VillageRules } from './village_rules'
import { createAccessToken } from '../../middleware/jwt'

const expectMetaBounds = expect.objectContaining({
  total: expect.any(Number),
  last_update: expect.toBeOneOf([null, expect.any(String)]),
})

const expectMetaPaginate = expect.objectContaining({
  current_page: expect.any(Number),
  from: expect.any(Number),
  last_page: expect.any(Number),
  per_page: expect.any(Number),
  to: expect.any(Number),
  total: expect.any(Number),
})

const expectMetaFindById = expect.any(Object)

const expectMetaSuggestion = expect.objectContaining({
  total: expect.any(Number),
})

const expectFindAll = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    level: expect.any(Number),
    city: expect.any(Object),
    district: expect.any(Object),
    category: expect.any(Object),
    location: expect.objectContaining({
      lat: expect.any(Number),
      lng: expect.any(Number),
    }),
    images: expect.any(Array),
  }),
])

const expectSuggestion = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    city: expect.any(Object),
  }),
])

const expectFindById = expect.objectContaining({
  id: expect.any(String),
  name: expect.any(String),
  level: expect.any(Number),
  city: expect.any(Object),
  category: expect.any(Object),
  district: expect.any(Object),
  location: expect.objectContaining({
    lat: expect.any(Number),
    lng: expect.any(Number),
  }),
  images: expect.any(Array),
})

const expectBodyFindById = expect.objectContaining({
  data: expectFindById,
  meta: expectMetaFindById,
})

const expectBodyFindAll = expect.objectContaining({
  data: expectFindAll,
  meta: expectMetaPaginate,
})

const expectBodySuggestion = expect.objectContaining({
  data: expectSuggestion,
  meta: expectMetaSuggestion,
})

const expectBodyFindAllBounds = expect.objectContaining({
  data: expectFindAll,
  meta: expectMetaBounds,
})

const expectBodyFindAllBoundsEmpty = expect.objectContaining({
  data: expect.any(Array),
  meta: expectMetaBounds,
})

const file = () => ({
  path: faker.image.avatar(),
  original_name: faker.image.avatar(),
  source: faker.image.avatar(),
})

const requestBodyQuestionnaire = {
  id: '123456785',
  level: 1,
  properties: {
    pemohon: {
      nama: faker.name.firstName(),
      posisi: faker.name.jobTitle(),
      file: file(),
      nomor_telepon: '023445354',
      email: faker.internet.email(),
    },
    fasilitas_desa: {
      akses_kendaraan: {
        data: [faker.random.arrayElement(VillageRules.optionsVehicles)],
        photo: file(),
      },
      suplai_listrik: {
        data: faker.name.firstName(),
        photo: file(),
      },
      jaringan_telepon: {
        data: faker.name.firstName(),
        photo: file(),
        operator: faker.name.firstName(),
      },
      jaringan_internet: {
        data: faker.name.firstName(),
        photo: file(),
        website: faker.name.firstName(),
      },
    },
  },
}

const storeVillage = {
  id: '32.04.40.2007',
  name: 'test',
  city_id: '32.04',
  district_id: '32.04.40',
  level: 1,
  longitude: '-21312312',
  latitude: '122213213',
}

const identifier = uuidv4()

const accessToken = createAccessToken({
  identifier,
  prtnr: false,
  adm: true,
})

describe('seed data', () => {
  it('insert villages', async () => {
    await database('villages').insert({
      id: '123456785',
      name: 'test',
      district_id: '1',
      level: 4,
      location: database.raw("ST_GeomFromText('POINT(107.5090974 -6.8342172)')"),
      is_active: true,
    })

    await database('villages').insert({
      id: '123456789',
      name: 'test3',
      district_id: '1',
      level: 1,
      location: database.raw("ST_GeomFromText('POINT(107.5090974 -6.8342172)')"),
      images: JSON.stringify([faker.image.image(), faker.image.image()]),
      is_active: false,
    })
  })
})

describe('tests villages', () => {
  it('test failed not found check registered', async () =>
    request(app)
      .get('/v1/villages/34543234565435654/check-registered')
      .expect(httpStatus.NOT_FOUND))
})

describe('tests villages', () => {
  it('test success check registered', async () =>
    request(app).get('/v1/villages/123456789/check-registered').expect(httpStatus.OK))
})

describe('tests villages', () => {
  it('test success with location find all', async () =>
    request(app)
      .get('/v1/villages/with-location')
      .query({
        bounds: {
          sw: '107.4312207548229,-7.044551821267334',
          ne: '107.78594184930455,-6.79575221317816',
        },
      })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodyFindAllBounds)
      }))
})

describe('tests villages', () => {
  it('test success questionnaire', async () =>
    request(app)
      .post('/v1/villages/questionnaire')
      .send(requestBodyQuestionnaire)
      .expect(httpStatus.CREATED))
})

describe('tests villages', () => {
  it('test success find all', async () =>
    request(app)
      .get('/v1/villages/list-with-location')
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodyFindAll)
      }))
})

describe('tests villages', () => {
  it('test success with query name find all', async () =>
    request(app)
      .get('/v1/villages/list-with-location')
      .query({ name: 'test', is_active: true })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodyFindAll)
      }))
})

describe('tests villages', () => {
  it('test success suggestion', async () =>
    request(app)
      .get('/v1/villages/suggestion')
      .set('Cache-Control', 'no-cache')
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodySuggestion)
      }))
})

describe('tests villages', () => {
  it('test success suggestion with query name', async () =>
    request(app)
      .get('/v1/villages/suggestion')
      .set('Cache-Control', 'no-cache')
      .query({
        name: 'test',
        is_active: true,
        district_id: '1',
      })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodySuggestion)
      }))
})

describe('tests villages', () => {
  it('test success with query level find all', async () =>
    request(app)
      .get('/v1/villages/list-with-location')
      .query({ level: 1 })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodyFindAll)
      }))
})

describe('tests villages', () => {
  it('test success with location find all', async () =>
    request(app)
      .get('/v1/villages/with-location')
      .query({
        bounds: {
          sw: '107.4312207548229,-7.044551821267334',
          ne: '107.78594184930455,-6.79575221317816',
        },
      })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodyFindAllBounds)
      }))
})

describe('tests villages', () => {
  it('test success with location and is active find all', async () =>
    request(app)
      .get('/v1/villages/with-location')
      .query({
        bounds: {
          sw: '107.4312207548229,-7.044551821267334',
          ne: '107.78594184930455,-6.79575221317816',
        },
        is_active: true,
      })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodyFindAllBounds)
      }))
})

describe('seed data', () => {
  it('update villages', async () => {
    await database('villages').where('id', '123456785').update({
      updated_at: new Date(),
    })
  })
})

describe('tests villages', () => {
  it('test success without query bounds', async () =>
    request(app)
      .get('/v1/villages/with-location')
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodyFindAllBoundsEmpty)
      }))
})

describe('tests villages', () => {
  it('test success without query bounds sw', async () =>
    request(app)
      .get('/v1/villages/with-location')
      .query({
        bounds: {
          ne: '107.78594184930455,-6.79575221317816',
        },
      })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodyFindAllBoundsEmpty)
      }))
})

describe('tests villages', () => {
  it('test failed not found find by id', async () =>
    request(app).get('/v1/villages/34543234565435654').expect(httpStatus.NOT_FOUND))
})

describe('tests villages', () => {
  it('responds success', async () =>
    request(app)
      .get('/v1/villages/123456785')
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectBodyFindById)
      }))
})

describe('tests villages', () => {
  it('create village success', async () =>
    request(app)
      .post('/v1/villages')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(storeVillage)
      .expect(httpStatus.CREATED))
})

describe('tests villages', () => {
  it('update village success', async () =>
    request(app)
      .put(`/v1/villages/${storeVillage.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(storeVillage)
      .expect(httpStatus.OK))
})

describe('tests villages', () => {
  it('update village error not found', async () =>
    request(app)
      .put(`/v1/villages/test1`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ...storeVillage,
        id: '32.04.40.2008',
      })
      .expect(httpStatus.NOT_FOUND))
})

describe('tests villages', () => {
  it('destroy village success', async () =>
    request(app)
      .delete(`/v1/villages/${storeVillage.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('tests villages', () => {
  it('destroy village error not found', async () =>
    request(app)
      .delete(`/v1/villages/test1`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})
