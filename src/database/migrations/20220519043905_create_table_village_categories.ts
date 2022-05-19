import { Knex } from 'knex';

const tableName = 'village_categories'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').unsigned()
    table.string('category_id').index()
    table.string('village_id', 14).index()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
