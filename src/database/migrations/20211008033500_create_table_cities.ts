import { Knex } from 'knex'

const tableName = 'cities'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.string('id', 5).primary()
    table.string('name', 60).notNullable()
    table.boolean('is_active').notNullable().index()
    table.string('area_id', 4).index()
    table.specificType('location', 'POINT').notNullable().index()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
