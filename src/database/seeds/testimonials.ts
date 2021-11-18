import { v4 as uuidv4 } from 'uuid'
import faker from 'faker'
import moment from 'moment';
import database from '../../config/database';

export async function seed(): Promise<void> {
  const data = []

  for (let index = 0; index < 10; index++) {
    data.push({
      id: uuidv4(),
      name: faker.name.findName(),
      description: faker.lorem.text(),
      avatar: faker.image.avatar(),
      type: faker.random.arrayElement(['mitra', 'masyarakat']),
      is_active: faker.datatype.boolean(),
      created_by: uuidv4(),
      created_at: moment().subtract({ seconds: (index + 1) }).toDate(),
    });
  }

  return database('testimonials').insert(data)
}
