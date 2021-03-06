import { Knex } from 'knex'

const tableName = 'oauth_tokens'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').index()
    table.string('access_token', 1000)
    table.string('refresh_token', 1000)
    table.integer('expired_in', 11)
    table.boolean('is_active').defaultTo(true)
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
