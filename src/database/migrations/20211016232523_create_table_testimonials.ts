import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.hasTable('testimonials').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('testimonials', function (table) {
        table.uuid('id').primary()
        table.text('caption').notNullable()
        table.timestamp('created_at')
        table.uuid('created_by').index().notNullable()
      })
    }
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('testimonials')
}