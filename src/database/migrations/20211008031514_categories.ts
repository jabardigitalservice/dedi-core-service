import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.hasTable('categories').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('categories', function (table) {
        table.increments('id').unsigned()
        table.string('name', 20).notNullable()
        table.boolean('is_active').notNullable().index()
      })
    }
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('categories')
}
