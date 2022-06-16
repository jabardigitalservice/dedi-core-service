import { Knex } from 'knex'

const tableName = 'pages'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.increments('id')
    table.uuid('created_by').notNullable().index()
    table.string('title', 70).notNullable().index()
    table.string('link').notNullable()
    table.integer('order').index()
    table.boolean('is_active').defaultTo(true).index()
    table.string('image').notNullable()
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
