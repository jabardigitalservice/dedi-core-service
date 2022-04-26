import { Knex } from 'knex'

const tableName = 'areas'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.string('id', 4).primary()
    table.string('name', 60).notNullable()
    table.boolean('is_active').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
