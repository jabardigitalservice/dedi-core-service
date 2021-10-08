import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.hasTable('villages').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('villages', function (table) {
        table.string('id', 8).primary()
        table.string('name', 60).notNullable()
        table.string('district_id', 8).notNullable().index()
        table.string('area_id', 4).index()
        table.integer('catogory_id').index()
        table.integer('level', 2).index()
        table.specificType('location', 'POINT').notNullable().index()
        table.json('images')
      })
    }
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('villages')
}
