import faker from 'faker'
import httpStatus from 'http-status'
import 'jest-extended'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import config from '../../config'
import database from '../../config/database'
import { UserStatus } from '../../helpers/constant'
import { createAccessToken } from '../../middleware/jwt'
import app from '../../server'
import { UserEntity } from './user_entity'

const name = faker.name.firstName()
const timestamp = new Date()
const userIdVillageApparatus = uuidv4()

describe('seed data', () => {
  it('insert partners', async () => {
    await database('partners').insert({
      id: uuidv4(),
      name: 'test-partner-users',
      total_village: 1,
      logo: 'https://test.com',
      website: 'https://test.com',
      created_at: timestamp,
      updated_at: timestamp,
      verified_at: timestamp,
    })
  })

  it('insert users role village apparatus', async () => {
    await database('users').insert({
      id: userIdVillageApparatus,
      name: 'test-partner-users',
      email: faker.internet.email(),
      is_village_apparatus: true,
      status: UserStatus.WAITING,
      created_at: timestamp,
    })
  })
})

const data = (): UserEntity.RequestBody => ({
  name,
  email: faker.internet.email(),
  roles: config.get('role.0'),
  avatar: faker.image.avatar(),
  avatar_original_name: faker.image.avatar(),
})

const dataPartner = (): UserEntity.RequestBody => ({
  name,
  email: faker.internet.email(),
  roles: config.get('role.1'),
  avatar: faker.image.avatar(),
  avatar_original_name: faker.image.avatar(),
  company: faker.name.firstName(),
})

const dataVerifyAccepted = (): UserEntity.RequestBodyVerify => ({
  is_verify: true,
})

const dataVerifyRejected = (): UserEntity.RequestBodyVerify => ({
  is_verify: false,
  notes: faker.name.firstName(),
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
  city: expect.any(Object),
  village: expect.any(Object),
  district: expect.any(Object),
  avatar: expect.any(Object),
  is_active: expect.any(Boolean),
  created_at: expect.toBeOneOf([null, expect.any(String)]),
  updated_at: expect.toBeOneOf([null, expect.any(String)]),
  status: expect.toBeOneOf([null, expect.any(String)]),
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
let userIdPartner: string
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
  it('test success store as partner', async () =>
    request(app)
      .post('/v1/users')
      .send(dataPartner())
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
  it('test success find all with query is partner', async () =>
    request(app)
      .get('/v1/users')
      .expect(httpStatus.OK)
      .query({ is_admin: false, roles: config.get('role.1') })
      .set('Authorization', `Bearer ${accessToken}`)
      .then((response) => {
        const [item] = response.body.data
        userIdPartner = item.id
      }))
})

describe('test users', () => {
  it('test success find all with query is village apparatus', async () =>
    request(app)
      .get('/v1/users')
      .expect(httpStatus.OK)
      .query({ is_admin: false, roles: config.get('role.2') })
      .set('Authorization', `Bearer ${accessToken}`))
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
  it(`test success find all with query selected list ${config.get('role.1')}`, async () =>
    request(app)
      .get('/v1/users')
      .expect(httpStatus.OK)
      .query({ is_active: true, is_admin: false, q: name, roles: config.get('role.1') })
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
  it('update users partner status partner set inactive', async () => {
    await database('users').whereNotNull('partner_id').update({
      status: UserStatus.INACTIVE,
    })
  })
})

describe('test users', () => {
  it('test success update status set is active true', async () =>
    request(app)
      .patch(`/v1/users/${userId}/status`)
      .send({ is_active: true })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('test users', () => {
  it('test success update status set is active false', async () =>
    request(app)
      .patch(`/v1/users/${userId}/status`)
      .send({ is_active: false })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('test users', () => {
  it('test success update status set is active true', async () =>
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
  it('test failed verify not found', async () =>
    request(app)
      .put('/v1/users/9999/verify')
      .send(dataVerifyAccepted())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.NOT_FOUND))
})

describe('test users', () => {
  it('test failed verify when status not is waiting', async () =>
    request(app)
      .put(`/v1/users/${userId}/verify`)
      .send(dataVerifyAccepted())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.BAD_REQUEST))
})

describe('test users', () => {
  it('update users partner status partner set waiting', async () => {
    await database('users').where('id', userIdPartner).update({
      status: UserStatus.WAITING,
    })
  })
})

describe('test users', () => {
  it('test success verify accepted', async () =>
    request(app)
      .put(`/v1/users/${userIdPartner}/verify`)
      .send(dataVerifyAccepted())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('test users', () => {
  it('update users partner status set waiting', async () => {
    await database('users').where('id', userIdPartner).update({
      status: UserStatus.WAITING,
    })
  })
})

describe('test users', () => {
  it('test success verified rejected', async () =>
    request(app)
      .put(`/v1/users/${userIdPartner}/verify`)
      .send(dataVerifyRejected())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('test users', () => {
  it('test success verify accepted role village apparatus', async () =>
    request(app)
      .put(`/v1/users/${userIdVillageApparatus}/verify`)
      .send(dataVerifyAccepted())
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(httpStatus.OK))
})

describe('test users', () => {
  it('update users role village apparatus status set waiting', async () => {
    await database('users').where('id', userIdVillageApparatus).update({
      status: UserStatus.WAITING,
    })
  })
})

describe('test users', () => {
  it('test success verified rejected case role village apparatus', async () =>
    request(app)
      .put(`/v1/users/${userIdVillageApparatus}/verify`)
      .send(dataVerifyRejected())
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
