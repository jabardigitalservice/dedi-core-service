import { Knex } from 'knex'

const tableName = 'questionnaires'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.increments('id').unsigned()
    table.string('village_id', 14).notNullable().index().unique()
    table.integer('level', 2).notNullable().index()
    table.string('status').index()
    table.json('properties')
    table.timestamp('created_at')
    table.timestamp('updated_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
