import { Knex } from 'knex'

const tableName = 'villages'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.string('id', 14).primary()
    table.string('name', 60).notNullable()
    table.string('district_id', 8).notNullable().index()
    table.string('area_id', 4).index()
    table.integer('category_id').index().unsigned()
    table.integer('level', 2).index()
    table.string('status', 10).index()
    table.specificType('location', 'POINT').notNullable().index()
    table.string('image')
    table.boolean('is_active').notNullable().index()
    table.timestamp('updated_at').index()
    table.json('properties')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
