import database from '../../config/database'
import { convertToBoolean } from '../../helpers/constant'
import { pagination } from '../../helpers/paginate'
import { PageEntity } from './page_entity'

export class PageRepository {
  private Pages = () => database<PageEntity.Struct>('pages')

  private Files = () => database<PageEntity.StructFile>('files')

  private Query = () =>
    this.Pages()
      .select(
        'pages.id',
        'title',
        'link',
        'is_active',
        'order',
        'image',
        'files.name as file_name',
        'files.source as file_source',
        'files.id as file_id',
        'pages.created_at'
      )
      .leftJoin('files', 'files.source', '=', 'pages.image')

  public findAll = (request: PageEntity.RequestQuery) => {
    const orderBy: string = request.order_by || 'created_at'
    const sortBy: string = request.sort_by || 'desc'

    const query = this.Query().orderBy(orderBy, sortBy)

    if (request.q) query.where('title', 'like', `%${request.q}%`)

    if (request.is_active) query.where('is_active', convertToBoolean(request.is_active))

    return query.paginate(pagination(request))
  }

  public findById = (id: string) => this.Query().where('pages.id', Number(id)).first()

  public store = (request: PageEntity.Struct) =>
    this.Pages().insert({
      ...request,
      created_at: new Date(),
    })

  public destroy = (id: number) => this.Pages().where('id', id).delete()

  public update = (request: PageEntity.Struct, id: number) =>
    this.Pages()
      .where('id', id)
      .update({
        ...request,
        updated_at: new Date(),
      })

  public createFile = (request: PageEntity.StructFile) =>
    this.Files()
      .insert({
        ...request,
        created_at: new Date(),
      })
      .onConflict('source')
      .merge(['name', 'created_at'])

  public updateFile = (request: PageEntity.StructFile, id: number) =>
    this.Files()
      .where('id', id)
      .update({
        ...request,
      })
}
