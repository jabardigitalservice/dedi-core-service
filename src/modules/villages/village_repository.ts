import database from '../../config/database';
import { Village as Entity } from './village_entity';
export namespace Village {
  export const Villages = () => database<Entity.Struct>('villages')

  export const findAllWithLocation = () => {
    const query = Villages()
      .select(
        'villages.id as id',
        'villages.name as villages_name',
        'villages.level',
        'cities.id as cities_id',
        'cities.name as cities_name',
        'categories.id as categories_id',
        'categories.name as categories_name',
        'villages.location',
        'images'
      )
      .leftJoin('districts', 'districts.id', '=', 'villages.district_id')
      .leftJoin('categories', 'categories.id', '=', 'villages.category_id')
      .leftJoin('cities', 'cities.id', '=', 'districts.city_id')
      .where('villages.is_active', true)
      .orderBy('villages.name', 'asc')

    return query
  }
}
