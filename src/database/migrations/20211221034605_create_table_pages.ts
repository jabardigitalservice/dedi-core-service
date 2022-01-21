import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('pages').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('pages', (table) => {
        table.increments('id')
        table.uuid('created_by').notNullable().index()
        table.string('title', 70).notNullable().index()
        table.string('link').notNullable()
        table.boolean('is_active').defaultTo(true).index()
        table.string('image').notNullable()
        table.timestamp('created_at').notNullable()
        table.timestamp('updated_at')
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('pages')
}
