import { v4 as uuidv4 } from 'uuid'
import faker from 'faker'
import { UserStatus } from '../../helpers/constant'
import { passwordHash } from '../../helpers/passwordHash'
import database from '../../config/database'

export async function seed(): Promise<void> {
  const datas = []

  for (let index = 0; index < 5; index++) {
    const name = faker.name.firstName()
    datas.push({
      id: uuidv4(),
      name,
      email: faker.internet.email(),
      password: passwordHash(name),
      created_at: new Date(),
      status: UserStatus.WAITING,
      village_id: '32.01.01.1001',
      is_village_apparatus: true,
      is_active: false,
    })
  }

  return database('users').insert(datas)
}
