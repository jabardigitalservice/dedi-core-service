import { Knex } from 'knex'

const tableName = 'users'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.renameColumn('status_partner', 'status')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.renameColumn('status', 'status_partner')
  })
}
