import request from 'supertest'
import app from '../../server'
import { Partner as Repository } from './partner_repository'
import { v4 as uuidv4 } from 'uuid'
const timestamp = new Date()
timestamp.setMilliseconds(0)

const ONE_MILISECOND = 1
const ONE_SECOND = 1000 * ONE_MILISECOND
const ONE_MINUTE = 60 * ONE_SECOND

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
      .query({ name: 'test2', current_page: 2 })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(expect.objectContaining({
          data: [],
          meta: expectMeta
        }))
      })
  })
})

describe('test partner suggestion', () => {
  it('returns partners that contain given substring', async () => {
    await Repository.Partners().insert([
      {
        id: uuidv4(),
        name: 'TokoPedia',
        total_village: 1,
        created_at: timestamp
      },
      {
        id: uuidv4(),
        name: 'TokoCrypto',
        total_village: 1,
        created_at: timestamp
      },
      {
        id: uuidv4(),
        name: 'Bukalapak',
        total_village: 1,
        created_at: timestamp
      }
    ])
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
})

describe('test partner suggestion', () => {
  it('returns empty list given query name length < 3', async () => {
    await Repository.Partners().insert({
      id: uuidv4(),
      name: 'TokoKita',
      total_village: 1,
      created_at: timestamp
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
})

describe('test partner suggestion', () => {
  it('returns empty list given no partner contain the requested name', async () => {
    await Repository.Partners().insert({
      id: uuidv4(),
      name: 'e-fishery',
      total_village: 1,
      created_at: timestamp
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
            }),
          })
        )
      })
  })
})

describe('test partners using cursor', () => {
  it('returns partners with cursor', async () => {
    const minuteBeforeTimestamp = (minute, timestamp) => new Date(timestamp - minute * ONE_MINUTE)

    await Repository.Partners().insert([
      {
        id: uuidv4(),
        name: 'TokoPedia',
        total_village: 1,
        created_at: minuteBeforeTimestamp(1, timestamp)
      },
      {
        id: uuidv4(),
        name: 'TokoCrypto',
        total_village: 1,
        created_at: minuteBeforeTimestamp(2, timestamp)
      },
    ])

    return request(app)
      .get('/v1/partnersUsingCursor')
      .query({ next_page: timestamp, per_page: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: 'TokoPedia'
              }),
            ]),
            meta: expect.objectContaining({
              per_page: 1,
              next_page: minuteBeforeTimestamp(1, timestamp).toISOString(),
            })
          }))
      })
  })
})
