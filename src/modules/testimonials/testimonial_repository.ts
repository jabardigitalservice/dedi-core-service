import { v4 as uuidv4 } from 'uuid'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { Testimonial as Entity } from './testimonial_entity'

export namespace Testimonial {
  const { Testimonials, Files } = Entity

  const Query = () =>
    Testimonials()
      .select(
        'testimonials.id',
        'testimonials.name',
        'testimonials.description',
        'testimonials.is_active',
        'testimonials.created_at',
        'avatar',
        'type',
        'partners.id as partner_id',
        'partners.name as partner_name',
        'villages.id as village_id',
        'villages.name as village_name',
        'files.name as file_name',
        'files.source as file_source',
        'files.id as file_id'
      )
      .leftJoin('partners', 'partners.id', '=', 'testimonials.partner_id')
      .leftJoin('villages', 'villages.id', '=', 'testimonials.village_id')
      .leftJoin('files', 'files.source', '=', 'testimonials.avatar')

  export const findAll = (requestQuery: Entity.RequestQuery) => {
    const orderBy: string = requestQuery.order_by || 'created_at'
    const sortBy: string = requestQuery.sort_by || 'desc'

    const query = Query().orderBy(orderBy, sortBy)

    if (requestQuery.is_active)
      query.where('testimonials.is_active', convertToBoolean(requestQuery.is_active))

    if (requestQuery.type) query.where('type', requestQuery.type)

    if (requestQuery.q) query.where('testimonials.name', 'like', `%${requestQuery.q}%`)

    return query.paginate(pagination(requestQuery))
  }

  export const store = (requestBody: Entity.Struct) =>
    Testimonials().insert({
      id: uuidv4(),
      ...requestBody,
      created_at: new Date(),
    })

  export const update = (requestBody: Entity.Struct, id: string) =>
    Testimonials()
      .where('id', id)
      .update({
        ...requestBody,
      })

  export const findById = (id: string) => Query().where('testimonials.id', id).first()

  export const destroy = (id: string) => Testimonials().where('id', id).delete()

  export const createFile = (requestBody: Entity.StructFile) =>
    Files()
      .insert({
        ...requestBody,
        created_at: new Date(),
      })
      .onConflict('source')
      .merge(['name', 'created_at'])

  export const updateFile = (requestBody: Entity.StructFile, id: number) =>
    Files()
      .where('id', id)
      .update({
        ...requestBody,
      })
}
