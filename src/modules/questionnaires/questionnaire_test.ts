import faker from 'faker'
import 'jest-extended'
import request from 'supertest'
import httpStatus from 'http-status'
import { v4 as uuidv4 } from 'uuid'
import app from '../../server'
import { QuestionnaireRules } from './questionnaire_rules'
import { createAccessToken } from '../../middleware/jwt'
import { expectMeta } from '../../helpers/test/expect'
import database from '../../config/database'

const file = () => ({
  path: faker.image.avatar(),
  original_name: faker.image.avatar(),
  source: faker.image.avatar(),
})

const identifier = uuidv4()

const accessToken = createAccessToken({
  identifier,
  prtnr: false,
  adm: true,
})

const requestBodyQuestionnaire = {
  id: '123456785213',
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
        data: [faker.random.arrayElement(QuestionnaireRules.optionsVehicles)],
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

describe('seed data', () => {
  it('insert villages', async () => {
    await database('villages').insert({
      id: '123456785213',
      name: 'test',
      district_id: '1',
      level: 4,
      location: database.raw("ST_GeomFromText('POINT(107.5090974 -6.8342172)')"),
      is_active: true,
    })
  })
})

describe('seed data', () => {
  it('insert categories', async () => {
    await database('categories').insert({
      id: 1,
      name: faker.name.firstName(),
      is_active: true,
      level: 4,
    })
  })

  it('insert village categories', async () => {
    await database('village_categories').insert({
      category_id: 1,
      village_id: '123456785213',
      is_verify: false,
    })
  })
})

const expectResponse = expect.objectContaining({
  id: expect.any(Number),
  status: expect.toBeOneOf([null, expect.any(String)]),
  created_at: expect.any(String),
  city: expect.any(Object),
  village: expect.any(Object),
  district: expect.any(Object),
  category: expect.any(Object),
})

const expectResponseFindById = expect.objectContaining({
  id: expect.any(Number),
  status: expect.toBeOneOf([null, expect.any(String)]),
  created_at: expect.any(String),
  city: expect.any(Object),
  village: expect.any(Object),
  district: expect.any(Object),
  category: expect.any(Object),
  properties: expect.any(Object),
})

const expectFindAll = expect.objectContaining({
  data: expect.arrayContaining([expectResponse]),
  meta: expectMeta,
})

const expectFindById = expect.objectContaining({
  data: expectResponseFindById,
  meta: {},
})

let id: number

describe('tests questionnaires', () => {
  it('test success questionnaire', async () =>
    request(app)
      .post('/v1/questionnaires')
      .send(requestBodyQuestionnaire)
      .expect(httpStatus.CREATED))
})

describe('tests questionnaires', () => {
  it('test success find all questionnaire', async () =>
    request(app)
      .get('/v1/questionnaires')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ level: 1 })
      .expect(httpStatus.OK)
      .then((response) => {
        const [item] = response.body.data
        id = item.id
        expect(response.body).toEqual(expectFindAll)
      }))
})

describe('tests questionnaires', () => {
  it('test success find all questionnaire with query level 4', async () =>
    request(app)
      .get('/v1/questionnaires')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ level: 4 })
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectFindAll)
      }))
})

describe('tests questionnaires', () => {
  it('test success find by id questionnaire', async () =>
    request(app)
      .get(`/v1/questionnaires/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectFindById)
      }))
})
