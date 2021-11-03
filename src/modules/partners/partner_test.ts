import request from 'supertest'
import app from '../../server'
import { Partner as Repository } from './partner_repository'
import { v4 as uuidv4 } from 'uuid'
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
  total: expect.any(Number)
})

const expectBody = expect.objectContaining({
  data: expect.arrayContaining([
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      total_village: expect.any(Number),
      logo: expect.any(String),
      created_at: expect.any(String),
      website: expect.any(String)
    })
  ]),
  meta: expectMeta
})

describe('tests partners', () => {
  it('test success findAll', async () => {
    return request(app)
      .get('/v1/partners')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expectBody)
      })
  })
})

describe('tests partners', () => {
  it('test success findAll with requestQuery', async () => {
    return request(app)
      .get('/v1/partners')
      .query({ name: 'test' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expectBody)
      })
  })
})

describe('tests partners', () => {
  it('test success findAll return data empty', async () => {
    return request(app)
      .get('/v1/partners')
      .query({ name: 'test', current_page: 2 })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          data: [],
          meta: expectMeta
        }))
      })
  })
})

// eslint-disable-next-line max-lines-per-function
describe('test partner suggestion', () => {
  // eslint-disable-next-line max-lines-per-function
  it('returns partners that contain given substring', async () => {
    await Repository.Partners().insert({
      id: uuidv4(),
      name: 'TokoPedia',
      total_village: 1,
    })
    await Repository.Partners().insert({
      id: uuidv4(),
      name: 'TokoCrypto',
      total_village: 1,
    })
    await Repository.Partners().insert({
      id: uuidv4(),
      name: 'Bukalapak',
      total_village: 1,
    })

    return request(app)
      .get('/v1/partners/suggestion')
      .query({ name: 'oko' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            data: expect.arrayContaining([
              {
                id: expect.any(String),
                name: 'TokoCrypto'
              },
              {
                id: expect.any(String),
                name: 'TokoPedia'
              },
            ]),
            meta: expect.objectContaining({
              total: 2
            })
          }))
      })
  })

  it('returns empty list given query name length < 3', async () => {
    await Repository.Partners().insert({
      id: uuidv4(),
      name: 'TokoKita',
      total_village: 1,
    })

    return request(app)
      .get('/v1/partners/suggestion')
      .query({ name: 'to' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            data: [],
            meta: expect.objectContaining({
              total: 0,
            })
          }))
      })
  })

  it('returns empty list given no partner contain the requested name', async () => {
    await Repository.Partners().insert({
      id: uuidv4(),
      name: 'e-fishery',
      total_village: 1,
    })

    return request(app)
      .get('/v1/partners/suggestion')
      .query({ name: 'efishery' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            data: [],
            meta: expect.objectContaining({
              total: 0,
            })
          }))
      })
  })
})
