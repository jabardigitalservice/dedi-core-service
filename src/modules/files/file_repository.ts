import database from '../../config/database';
import { File as Entity } from './file_entity';

export namespace File {
  export const Files = () => database<Entity.Struct>('files')

  export const destroy = (source: string) => Files().where('source', source).delete()
}
