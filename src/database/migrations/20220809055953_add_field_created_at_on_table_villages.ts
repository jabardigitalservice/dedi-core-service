import { Knex } from 'knex'

const tableName = 'villages'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.timestamp('created_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('created_at')
  })
}
