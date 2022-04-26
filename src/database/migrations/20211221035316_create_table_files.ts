import { Knex } from 'knex';

const tableName = 'files'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.increments('id')
    table.string('name').notNullable().index()
    table.string('source').notNullable().index().unique()
    table.timestamp('created_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
