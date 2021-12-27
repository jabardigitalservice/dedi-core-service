import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('users').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary()
        table.string('name', 100).notNullable()
        table.uuid('partner_id').index()
        table.string('avatar')
        table.string('email', 150).notNullable().index()
        table.string('password', 72)
        table.boolean('is_admin').defaultTo(false)
        table.boolean('is_active').defaultTo(true)
        table.string('google_id').index()
        table.timestamp('created_at').notNullable()
        table.timestamp('verified_at')
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users')
}
