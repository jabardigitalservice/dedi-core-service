import { v4 as uuidv4 } from 'uuid'
import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { TestimonialEntity } from './testimonial_entity'

export class TestimonialRepository {
  private Testimonials = () => database<TestimonialEntity.Struct>('testimonials')

  private Files = () => database<TestimonialEntity.StructFile>('files')

  private Query = () =>
    this.Testimonials()
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

  public findAll = (request: TestimonialEntity.RequestQuery) => {
    const orderBy: string = request.order_by || 'created_at'
    const sortBy: string = request.sort_by || 'desc'

    const query = this.Query().orderBy(orderBy, sortBy)

    if (convertToBoolean(request.is_active))
      query.where('testimonials.is_active', convertToBoolean(request.is_active))

    if (request.type) query.where('type', request.type)

    if (request.q) query.where('testimonials.name', 'like', `%${request.q}%`)

    return query.paginate(pagination(request))
  }

  public store = (request: TestimonialEntity.Struct) =>
    this.Testimonials().insert({
      id: uuidv4(),
      ...request,
      created_at: new Date(),
    })

  public update = (request: TestimonialEntity.Struct, id: string) =>
    this.Testimonials()
      .where('id', id)
      .update({
        ...request,
      })

  public findById = (id: string) => this.Query().where('testimonials.id', id).first()

  public destroy = (id: string) => this.Testimonials().where('id', id).delete()

  public createFile = (request: TestimonialEntity.StructFile) =>
    this.Files()
      .insert({
        ...request,
        created_at: new Date(),
      })
      .onConflict('source')
      .merge(['name', 'created_at'])

  public updateFile = (request: TestimonialEntity.StructFile, id: number) =>
    this.Files()
      .where('id', id)
      .update({
        ...request,
      })
}
