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
      category_id: null,
      verified_at: moment().subtract({ seconds: (index + 1) }).toDate(),
      logo: faker.image.avatar(),
      total_village: faker.datatype.number({ min: 1, max: 10 }),
      website: faker.internet.url(),
      created_at: moment().subtract({ seconds: (index + 1) }).toDate(),
    });
  }

  return database('partners').insert(data)
}
