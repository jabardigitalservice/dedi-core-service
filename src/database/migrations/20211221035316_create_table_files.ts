import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('files').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('files', (table) => {
        table.increments('id')
        table.string('name').notNullable().index()
        table.string('path').notNullable().index()
        table.timestamp('created_at').notNullable()
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('files')
}
