import database from '../../config/database';
import { Village as Entity } from './village_entity';

export namespace Village {
  export const Villages = () => database<Entity.Struct>('villages')

  export const findAllWithLocation = () => {
    const query = Villages()
      .select('id', 'name', 'level', 'location')
      .where('is_active', true)
      .orderBy('name', 'asc')

    return query
  }
}
