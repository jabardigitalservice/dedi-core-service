import faker from 'faker'
import 'jest-extended'
import request from 'supertest'
import httpStatus from 'http-status'
import app from '../../server'
import database from '../../config/database'
import { QuestionnaireRules } from './questionnaire_rules'

const file = () => ({
  path: faker.image.avatar(),
  original_name: faker.image.avatar(),
  source: faker.image.avatar(),
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

describe('tests villages', () => {
  it('test success questionnaire', async () =>
    request(app)
      .post('/v1/villages/questionnaire')
      .send(requestBodyQuestionnaire)
      .expect(httpStatus.CREATED))
})
