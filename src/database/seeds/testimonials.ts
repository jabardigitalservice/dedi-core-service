import { v4 as uuidv4 } from 'uuid'
import faker from 'faker'
import database from '../../config/database';

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
      created_at: new Date(),
    });
  }

  return database('testimonials').insert(data)
}
