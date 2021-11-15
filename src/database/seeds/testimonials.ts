import { v4 as uuidv4 } from 'uuid'
import faker from 'faker'
import database from '../../config/database';

const timestamp = new Date()
timestamp.setMilliseconds(0)

const ONE_MILISECOND = 1
const ONE_SECOND = 1000 * ONE_MILISECOND
const ONE_MINUTE = 60 * ONE_SECOND

const minuteBeforeTimestamp = (minute, timestamp) => new Date(timestamp - minute * ONE_MINUTE)

export async function seed(): Promise<void> {
  const data = []

  for (let index = 0; index < 10; index++) {
    const user_id = uuidv4()
    data.push({
      id: uuidv4(),
      name: faker.name.findName(),
      description: faker.lorem.text(),
      avatar: faker.image.avatar(),
      type: faker.random.arrayElement(['mitra', 'masyarakat']),
      is_active: faker.datatype.boolean(),
      created_by: user_id,
      created_at: minuteBeforeTimestamp((index + 1), timestamp),
    });
  }

  return database('testimonials').insert(data)
}
