import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return knex.schema.createTable('users', function (table) {
        table.uuid('id').primary()
        table.string('name', 100).notNullable()
        table.string('avatar').notNullable()
        table.string('email', 150).notNullable()
        table.string('password', 72)
        table.string('google_id')
        table.timestamp('created_at').notNullable()
        table.timestamp('verified_at')
      })
    }
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users')
}
