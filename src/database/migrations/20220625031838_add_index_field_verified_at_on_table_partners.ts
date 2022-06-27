import { Knex } from 'knex'

const tableName = 'partners'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.index('verified_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropIndex('verified_at')
  })
}
