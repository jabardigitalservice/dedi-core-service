import { v4 as uuidv4 } from 'uuid'
import faker from 'faker'
import moment from 'moment'
import database from '../../config/database'

export async function seed(): Promise<void> {
  const data = []

  for (let index = 0; index < 10; index++) {
    data.push({
      id: uuidv4(),
      name: faker.name.findName(),
      verified_at: moment()
        .subtract({ seconds: index + 1 })
        .toDate(),
      logo: `https://avatars.dicebear.com/api/gridy/${faker.name.findName()}.svg`,
      total_village: faker.datatype.number({ min: 200, max: 2000 }),
      website: faker.internet.url(),
      created_at: moment()
        .subtract({ seconds: index + 1 })
        .toDate(),
    })
  }

  return database('partners').insert(data)
}
