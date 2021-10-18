import database from '../../config/database'
import { perPage } from '../../helpers/paginate'
import { Testimonial as Entity } from '../testimonials/testimonial_entity'

export namespace Testimonial {
  export const Testimonials = () => database<Entity.Struct>('testimonials')

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const query = Testimonials()
      .select(
        'testimonials.id as id',
        'caption',
        'users.id as user_id',
        'users.name as user_name',
        'users.type as user_type',
        'users.description as user_description',
        'users.avatar as user_avatar'
      )
      .leftJoin('users', 'users.id', '=', 'testimonials.created_by')

    return query.paginate(perPage(requestQuery))
  }
}
