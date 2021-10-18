import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.hasTable('districts').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('districts', function (table) {
        table.string('id', 8).primary()
        table.string('name', 60).notNullable()
        table.string('city_id', 5).notNullable().index()
        table.boolean('is_active').notNullable().index()
        table.string('area_id', 4).index()
      })
    }
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('districts')
}