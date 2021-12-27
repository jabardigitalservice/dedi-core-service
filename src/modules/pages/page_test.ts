import request from 'supertest'
import faker from 'faker'
import httpStatus from 'http-status'
import { v4 as uuidv4 } from 'uuid'
import app from '../../server'
import { Page as Entity } from './page_entity'
import { Page as Service } from './page_service'
import { createAccessToken } from '../../middleware/jwt'

const expectMeta = expect.objectContaining({
  current_page: expect.any(Number),
  from: expect.any(Number),
  last_page: expect.any(Number),
  per_page: expect.any(Number),
  to: expect.any(Number),
  total: expect.any(Number),
})

const expectResponse = expect.objectContaining({
  id: expect.any(Number),
  title: expect.any(String),
  description: expect.any(String),
  is_active: expect.any(Boolean),
  file: expect.objectContaining({
    path: expect.any(String),
    filename: expect.any(String),
    original_name: expect.any(String),
  }),
})

const expectFindAll = expect.objectContaining({
  data: expect.arrayContaining([expectResponse]),
  meta: expectMeta,
})

const expectFindById = expect.objectContaining({
  data: expectResponse,
  meta: {},
})

const identifier = uuidv4()

const accessToken = createAccessToken({
  identifier,
  prtnr: false,
  adm: true,
})

const title = faker.lorem.slug(2)

const data = (): Entity.RequestBody => ({
  title,
  description: faker.lorem.paragraph(),
  is_active: 'true',
  filename: faker.image.image(),
  original_name: faker.image.image(),
})

let pagesId: number

describe('seed pages', () => {
  it('insert pages', async () => {
    const [id] = await Service.store(data(), { identifier })
    pagesId = id
  })
})

describe('tests pages', () => {
  it('test success store', async () => request(app)
    .post('/v1/pages')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(data())
    .expect(httpStatus.CREATED))
})

describe('tests pages', () => {
  it('test success update', async () => request(app)
    .put(`/v1/pages/${pagesId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(data())
    .expect(httpStatus.OK))
})

describe('tests pages', () => {
  it('test failed not found update', async () => request(app)
    .put('/v1/pages/9999')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(data())
    .expect(httpStatus.NOT_FOUND))
})

describe('tests pages', () => {
  it('test success find all', async () => request(app)
    .get('/v1/pages')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Cache-Control', 'no-cache')
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectFindAll)
    }))
})

describe('tests pages', () => {
  it('test success with query find all', async () => request(app)
    .get('/v1/pages')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Cache-Control', 'no-cache')
    .query({ q: title, is_active: true })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectFindAll)
    }))
})

describe('tests pages', () => {
  it('test success find by id', async () => request(app)
    .get(`/v1/pages/${pagesId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectFindById)
    }))
})

describe('tests pages', () => {
  it('test failed not found find by id', async () => request(app)
    .get('/v1/pages/99999')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(httpStatus.NOT_FOUND))
})

describe('tests pages', () => {
  it('test success destroy', async () => request(app)
    .delete(`/v1/pages/${pagesId}`)
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(httpStatus.OK))
})

describe('tests pages', () => {
  it('test failed not found destroy', async () => request(app)
    .delete('/v1/pages/9999')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(httpStatus.NOT_FOUND))
})
