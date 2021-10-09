import database from '../../config/database';
import { Partner as Entity } from './partner_entity';

export namespace Partner {
  export const Partners = () => database<Entity.Struct>('partners')
}
