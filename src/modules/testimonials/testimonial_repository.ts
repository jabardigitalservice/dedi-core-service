import { v4 as uuidv4 } from 'uuid'
import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { Testimonial as Entity } from './testimonial_entity'

export namespace Testimonial {
  export const Testimonials = () => database<Entity.Struct>('testimonials')

  const Query = () => Testimonials()
    .select(
      'testimonials.id',
      'testimonials.name',
      'testimonials.description',
      'avatar',
      'type',
      'partners.id as partner_id',
      'partners.name as partner_name',
      'villages.id as village_id',
      'villages.name as village_name',
    )
    .leftJoin('partners', 'partners.id', '=', 'testimonials.partner_id')
    .leftJoin('villages', 'villages.id', '=', 'testimonials.village_id')

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const orderBy: string = requestQuery.order_by || 'type'
    const sortBy: string = requestQuery.sort_by || 'asc'

    const query = Query().orderBy(orderBy, sortBy)

    if (requestQuery.is_active) query.where('testimonials.is_active', convertToBoolean(requestQuery.is_active))

    if (requestQuery.type) query.where('type', requestQuery.type)

    return query.paginate(pagination(requestQuery))
  }

  export const store = async (requestBody: Entity.Struct) => Testimonials().insert({
    id: uuidv4(),
    ...requestBody,
    created_at: new Date(),
  })

  export const update = async (requestBody: Entity.Struct, id: string) => Testimonials().where('id', id).update({
    ...requestBody,
  })

  export const findById = async (id: string) => Query().where('testimonials.id', id).first()

  export const destroy = async (id: string) => Testimonials().where('id', id).delete()
}
