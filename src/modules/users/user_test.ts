import faker from 'faker'
import httpStatus from 'http-status'
import 'jest-extended'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { createAccessToken } from '../../middleware/jwt'
import app from '../../server'
import { UserEntity } from './user_entity'

const name = faker.name.firstName()

const data = (): UserEntity.RequestBody => ({
  name,
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  avatar_original_name: faker.image.avatar(),
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
    original_name: expect.toBeOneOf([null, expect.any(String)]),
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
let accessTokenByUser: string

describe('test users', () => {
  it('test success store', async () =>
    request(app)
      .post('/v1/users')
      .send({
        ...data(),
        password: 'test1234',
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.CREATED))
})

describe('test users', () => {
  it('test success find all', async () =>
    request(app)
      .get('/v1/users')
      .expect(httpStatus.OK)
      .set('Authorization', `Bearer ${accessToken}`)
      .then((response) => {
        const [item] = response.body.data
        userId = item.id
        accessTokenByUser = createAccessToken({
          identifier: userId,
          prtnr: false,
          adm: true,
        })
        expect(response.body).toEqual(expectFindAll)
      }))
})

describe('test users', () => {
  it('test success find all with query', async () =>
    request(app)
      .get('/v1/users')
      .expect(httpStatus.OK)
      .query({ is_active: true, is_admin: true, q: name })
      .set('Authorization', `Bearer ${accessToken}`))
})

describe('test users', () => {
  it('test success find by id', async () =>
    request(app)
      .get(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectFindById)
      }))
})

describe('test users', () => {
  it('test failed find by id not found', async () =>
    request(app)
      .get('/v1/users/9999')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})

describe('test users', () => {
  it('test failed update status not found', async () =>
    request(app)
      .patch('/v1/users/9999/status')
      .send({ is_active: true })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})

describe('test users', () => {
  it('test success update status', async () =>
    request(app)
      .patch(`/v1/users/${userId}/status`)
      .send({ is_active: true })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('test users', () => {
  it('test failed update not found', async () =>
    request(app)
      .put('/v1/users/9999')
      .send(data())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})

describe('test users', () => {
  it('test success update', async () =>
    request(app)
      .put(`/v1/users/${userId}`)
      .send(data())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('test users', () => {
  it('test failed destroy not found', async () =>
    request(app)
      .delete('/v1/users/9999')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})

describe('test users', () => {
  it('test failed destroy self remove', async () =>
    request(app)
      .delete(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${accessTokenByUser}`)
      .expect(httpStatus.FORBIDDEN))
})

describe('test users', () => {
  it('test success destroy', async () =>
    request(app)
      .delete(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})
