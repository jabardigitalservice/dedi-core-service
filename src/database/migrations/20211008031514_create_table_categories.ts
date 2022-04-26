import { Knex } from 'knex'

const tableName = 'categories'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').unsigned()
    table.string('name', 20).notNullable().unique()
    table.boolean('is_active').notNullable().index()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
