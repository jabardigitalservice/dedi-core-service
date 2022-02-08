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
  link: expect.any(String),
  is_active: expect.any(Boolean),
  order: expect.any(Number),
  image: expect.objectContaining({
    path: expect.any(String),
    source: expect.any(String),
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
  link: faker.internet.url(),
  is_active: true,
  image: faker.image.image(),
  order: faker.datatype.number(10),
  image_original_name: faker.image.image(),
})

const dataRandomTitle = (): Entity.RequestBody => ({ ...data(), title: faker.lorem.slug(2) })

let pagesId: number

describe('seed pages', () => {
  it('insert pages', async () => {
    const [id] = await Service.store(data(), { identifier })
    pagesId = id
  })
})

describe('tests pages', () => {
  it('test failed not found update', async () => request(app)
    .put('/v1/pages/9999')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(dataRandomTitle())
    .expect(httpStatus.NOT_FOUND)
    .then((response) => {
      console.log(response.body);

    }))
})

describe('tests pages', () => {
  it('test success store', async () => request(app)
    .post('/v1/pages')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(dataRandomTitle())
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
