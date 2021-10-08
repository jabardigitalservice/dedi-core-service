import { knex } from 'knex'
import { attachPaginate } from 'knex-paginate'
import config from '.'
import knexfile from '../knexfile'

const database = knex(knexfile[config.get('node.env')])

attachPaginate()

export default database
