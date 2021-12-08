import { v4 as uuidv4 } from 'uuid'
import faker from 'faker'
import moment from 'moment';
import database from '../../config/database';
import config from '../../config';

export async function seed(): Promise<void> {
  const data = []

  for (let index = 0; index < 10; index++) {
    data.push({
      id: uuidv4(),
      name: faker.name.findName(),
      description: faker.lorem.text(),
      avatar: `https://avatars.dicebear.com/api/micah/${faker.name.findName()}.svg`,
      type: faker.random.arrayElement([config.get('role.1'), config.get('role.2')]),
      is_active: faker.datatype.boolean(),
      created_by: uuidv4(),
      created_at: moment().subtract({ seconds: (index + 1) }).toDate(),
    });
  }

  return database('testimonials').insert(data)
}
