import faker from 'faker'
import httpStatus from 'http-status'
import 'jest-extended'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { createAccessToken } from '../../middleware/jwt'
import app from '../../server'
import { User as Entity } from './user_entity'

const data = (): Entity.RequestBody => ({
  name: faker.name.firstName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  avatar_original_name: faker.image.avatar(),
  is_active: faker.random.arrayElement(['true', 'false']),
})

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
  email: expect.any(String),
  role: expect.any(String),
  avatar: {
    path: expect.any(String),
    source: expect.any(String),
    original_name: expect.any(String),
  },
  is_active: expect.any(Boolean),
  created_at: expect.toBeOneOf([null, expect.any(String)]),
  updated_at: expect.toBeOneOf([null, expect.any(String)]),
  last_login_at: expect.toBeOneOf([null, expect.any(String)]),
})

const expectFindAll = expect.objectContaining({
  data: expect.arrayContaining([expectResponse]),
  meta: expectMeta,
})

const expectFindById = expect.objectContaining({
  data: expectResponse,
  meta: {},
})

let userId: string

describe('test users', () => {
  it('test success store', async () => request(app)
    .post('/v1/users')
    .send({
      ...data(),
      password: 'test123',
      password_confirm: 'test123',
    })
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(httpStatus.CREATED))
})

describe('test users', () => {
  it('test success find all', async () => request(app)
    .get('/v1/users')
    .expect(httpStatus.OK)
    .set('Authorization', `Bearer ${accessToken}`)
    .then((response) => {
      const [item] = response.body.data
      userId = item.id
      expect(response.body).toEqual(expectFindAll)
    }))
})

describe('test users', () => {
  it('test success find by id', async () => request(app)
    .get(`/v1/users/${userId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectFindById)
    }))
})
