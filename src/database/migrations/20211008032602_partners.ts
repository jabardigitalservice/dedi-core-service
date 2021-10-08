import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.hasTable('partners').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('partners', function (table) {
        table.uuid('id').primary()
        table.string('name', 100).notNullable().unique()
        table.integer('catogory_id').index()
        table.timestamp('deleted_at')
        table.timestamp('verified_at')
        table.string('logo')
        table.integer('total_village').defaultTo(0)
        table.timestamps()
      })
    }
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('partners')
}
