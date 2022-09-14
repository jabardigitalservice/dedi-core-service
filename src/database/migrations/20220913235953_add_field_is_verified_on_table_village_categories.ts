import { Knex } from 'knex'

const tableName = 'village_categories'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.boolean('is_verify').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.dropIndex('is_verify')
    table.dropColumn('is_verify')
  })
}
