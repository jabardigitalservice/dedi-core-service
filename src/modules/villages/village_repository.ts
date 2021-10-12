import database from '../../config/database';
import { Village as Entity } from './village_entity';
import knexPostgis from 'knex-postgis';
const st = knexPostgis(database);

export namespace Village {
  export const Villages = () => database<Entity.Struct>('villages')

  export const findAllWithLocation = () => {
    const query = Villages()
      .select(
        'id',
        'name',
        'level',
        st.asGeoJSON('location')
      )
      .where('is_active', true)
      .orderBy('name', 'asc')

    return query
  }
}
