import database from '../../config/database'
import { perPage } from '../../helpers/paginate'
import { Testimonial as Entity } from '../testimonials/testimonial_entity'

export namespace Testimonial {
  export const Testimonials = () => database<Entity.TestimonialStruct>('testimonials')
  export const Users = () => database<Entity.UserStruct>('users')

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
      .join('users', 'users.id', '=', 'testimonials.created_by')

    if (requestQuery.type) query.where('users.type', requestQuery.type)

    return query.paginate(perPage(requestQuery))
  }
}
