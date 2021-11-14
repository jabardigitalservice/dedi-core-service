import database from '../../config/database'
import { perPage } from '../../helpers/paginate'
import { Testimonial as Entity } from './testimonial_entity'

export namespace Testimonial {
  export const Testimonials = () => database<Entity.Struct>('testimonials')

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const query = Testimonials()
      .select('id', 'name', 'description', 'avatar', 'type')
      .where('is_active', true)

    if (requestQuery.type) query.where('type', requestQuery.type)

    return query.paginate(perPage(requestQuery))
  }
}
