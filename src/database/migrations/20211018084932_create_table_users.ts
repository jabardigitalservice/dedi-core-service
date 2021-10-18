import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', function (table) {
        table.uuid('id').primary()
        table.string('name', 100).notNullable()
        table.text('description').notNullable()
        table.string('avatar').notNullable()
        table.string('type', 15).notNullable()
      })
    }
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users')
}
