import { Knex } from 'knex'

const tableName = 'users'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.string('status_partner').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropIndex('status_partner')
    table.dropColumn('status_partner')
  })
}
