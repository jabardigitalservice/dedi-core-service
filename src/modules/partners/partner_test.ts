import 'jest-extended'
import httpStatus from 'http-status'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import app from '../../server'
import { Partner as Repository } from './partner_repository'

const timestamp = new Date()

describe('seed data', () => {
  it('insert partners', async () => {
    await Repository.Partners().insert({
      id: uuidv4(),
      name: 'test',
      total_village: 1,
      logo: 'https://test.com',
      website: 'https://test.com',
      created_at: timestamp,
      updated_at: timestamp,
    })
  })
})

const expectMeta = expect.objectContaining({
  current_page: expect.any(Number),
  from: expect.any(Number),
  last_page: expect.any(Number),
  per_page: expect.any(Number),
  to: expect.any(Number),
  total: expect.any(Number),
  last_update: expect.toBeOneOf([null, expect.any(String)]),
})

const expectFindAll = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    total_village: expect.any(Number),
    logo: expect.any(String),
    created_at: expect.any(String),
    website: expect.any(String),
  }),
])

const expectMetaSuggestion = expect.objectContaining({
  total: expect.any(Number),
})

const expectSuggestion = expect.arrayContaining([
  expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
  }),
])

const expectBodyFindAll = expect.objectContaining({
  data: expectFindAll,
  meta: expectMeta,
})

const expectEmptyBodyFindAll = expect.objectContaining({
  data: [],
  meta: expectMeta,
})

const expectBodySuggestion = expect.objectContaining({
  data: expectSuggestion,
  meta: expectMetaSuggestion,
})

const expectEmptyBodySuggestion = expect.objectContaining({
  data: [],
  meta: expectMetaSuggestion,
})

describe('tests partners', () => {
  it('test success find all', async () => request(app)
    .get('/v1/partners')
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodyFindAll)
    }))
})

describe('tests partners', () => {
  it('test success find all with query name', async () => request(app)
    .get('/v1/partners')
    .query({ name: 'test' })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodyFindAll)
    }))
})

describe('tests partners', () => {
  it('test success find all with query name return data empty', async () => request(app)
    .get('/v1/partners')
    .query({ name: 'test2' })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectEmptyBodyFindAll)
    }))
})

describe('tests partners', () => {
  it('returns partners that contain given substring', async () => request(app)
    .get('/v1/partners/suggestion')
    .query({ name: 'tes' })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodySuggestion)
    }))
})

describe('tests partners', () => {
  it('test success suggestion with given query name length < 3 return data empty', async () => request(app)
    .get('/v1/partners/suggestion')
    .query({ name: 'te' })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodySuggestion)
    }))
})

describe('tests partners', () => {
  it('test success suggestion with query name return data empty', async () => request(app)
    .get('/v1/partners/suggestion')
    .query({ name: 'test1' })
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectEmptyBodySuggestion)
    }))
})

describe('tests partners', () => {
  it('test success suggestion without query', async () => request(app)
    .get('/v1/partners/suggestion')
    .expect(httpStatus.OK)
    .then((response) => {
      expect(response.body).toEqual(expectBodySuggestion)
    }))
})

describe('tests partners', () => {
  it('test success find all data is deleted return data empty', async () => {
    await Repository.Partners().where('name', 'test').update({ deleted_at: new Date() })
    return request(app)
      .get('/v1/partners')
      .expect(httpStatus.OK)
      .then((response) => {
        expect(response.body).toEqual(expectEmptyBodyFindAll)
      })
  })
})
