import { v4 as uuidv4 } from 'uuid'
import faker from 'faker'
import database from '../../config/database';

export async function seed (): Promise<void> {
  for (let index = 0; index < 10; index++) {
    const user_id = uuidv4()

    // Inserts seed users
    await database('users').insert({
      id: user_id,
      name: faker.name.findName(),
      description: faker.lorem.text(),
      avatar: faker.image.avatar(),
      type: faker.random.arrayElement(['mitra', 'masyarakat'])
    })

    // Inserts seed testimonials
    await database('testimonials').insert({
      id: uuidv4(),
      caption: faker.lorem.slug(),
      created_by: user_id,
      created_at: new Date()
    });
  }
};
