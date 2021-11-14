import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('oauth_tokens').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('oauth_tokens', (table) => {
        table.uuid('id').primary()
        table.uuid('user_id').index()
        table.string('access_token', 767).index()
        table.string('refresh_token', 767).index()
        table.integer('expired_in', 11)
        table.boolean('is_active').defaultTo(true)
        table.timestamp('created_at').notNullable()
        table.timestamp('updated_at')
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('oauth_tokens')
}
