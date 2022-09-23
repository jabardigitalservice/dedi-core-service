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

const requestBodyQuestionnaireLevelOne = {
  id: '123456785213',
  level: 1,
  sk: file(),
  properties: {
    applicant: {
      name: faker.name.firstName(),
      position: faker.name.jobTitle(),
      phone_number: '023445354',
      email: faker.internet.email(),
    },
    facility: {
      vehicle_access: {
        data: [faker.random.arrayElement(QuestionnaireRules.optionsVehicles)],
        photo: file(),
      },
      power_supply: {
        data: faker.name.firstName(),
        photo: file(),
      },
      cellular_network: {
        data: faker.name.firstName(),
        photo: file(),
        operator: faker.name.firstName(),
      },
      internet_network: {
        data: faker.name.firstName(),
        photo: file(),
        website: faker.name.firstName(),
      },
    },
  },
}

const requestBodyQuestionnaireLevelFour = {
  id: '123456785220',
  level: 4,
  sk: {
    path: 'https://dedi-cdn.digitalservice.id/development/3164a5af-e021-4920-b0b0-341e1e696445.pdf',
    original_name:
      'Robert C. Martin - Clean Code_ A Handbook of Agile Software Craftsmanship-Prentice Hall (2008).pdf',
    source: '3164a5af-e021-4920-b0b0-341e1e696445.pdf',
  },
  properties: {
    applicant: {
      name: 'Doohan Aditya Saputro',
      position: 'Kades Bekasi',
      phone_number: '0863535626',
      email: 'dassz@gmail.com',
    },
    facility: {
      vehicle_access: {
        data: ['Motor', 'Mobil', 'Kendaraan Umum (Bus/Elf)'],
        photo: {
          path: null,
          original_name: null,
          source: null,
        },
      },
      power_supply: {
        data: 'Ada listrik dan stabil',
        photo: {
          path: null,
          original_name: null,
          source: null,
        },
      },
      cellular_network: {
        data: 'Ada jaringan seluler yang stabil',
        photo: {
          path: null,
          original_name: null,
          source: null,
        },
        operator: 'Telkomsel, XL',
      },
      internet_network: {
        data: 'Sudah ada jaringan internet yang stabil',
        photo: {
          path: null,
          original_name: null,
          source: null,
        },
        website: 'Gojek, Lazada',
      },
    },
    literacy: {
      community: {
        data: [
          'Pendamping Lokal Desa',
          'Patriot Desa',
          'Relawan TIK',
          'Komunitas Teknologi Digital',
        ],
        photo: {
          path: null,
          original_name: null,
          source: null,
        },
      },
      training: {
        data: 'Pernah, lebih dari 2 kali',
        photo: {
          path: null,
          original_name: null,
          source: null,
        },
        training: 'Coding, desain',
      },
    },
    business: {
      social_media: {
        data: ['Facebook', 'Instagram', 'Twitter', 'Youtube'],
        photo: {
          path: null,
          original_name: null,
          source: null,
        },
      },
      bumdes: {
        data: 'Ada BUMDes dan masih aktif',
        photo: {
          path: null,
          original_name: null,
          source: null,
        },
        name: 'Bumdes bekasi',
      },
      commodity: {
        data: 'makanan hewan',
        photo: {
          path: null,
          original_name: null,
          source: null,
        },
        productivity: 'Ya, masih aktif',
      },
      ecommerce: {
        data: ['Tokopedia', 'Shopee', 'Lazada'],
        other_ecommerce: null,
        distribution: 'Ya, sudah tergabung dengan e-commerce',
      },
      logistics: 'Ya, sudah dapat dijangkau kurir logistik',
    },
    potential: {
      data: ['Pertanian', 'Perikanan', 'Kesehatan'],
      other_potential: null,
      growth_potential: null,
      photo: {
        path: null,
        original_name: null,
        source: null,
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
    await database('villages').insert({
      id: '123456785220',
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
      .send(requestBodyQuestionnaireLevelOne)
      .expect(httpStatus.CREATED))
})

describe('tests questionnaires', () => {
  it('test success questionnaire level 4', async () =>
    request(app)
      .post('/v1/questionnaires')
      .send(requestBodyQuestionnaireLevelFour)
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

describe('tests questionnaires', () => {
  it('test failed find by id questionnaire not found', async () =>
    request(app)
      .get(`/v1/questionnaires/9999`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})
