import { Knex } from 'knex'

const tableName = 'testimonials'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary()
    table.string('name', 100).notNullable()
    table.text('description').notNullable()
    table.string('avatar').notNullable()
    table.string('type', 15).notNullable().index()
    table.boolean('is_active').notNullable().index().defaultTo(true)
    table.uuid('partner_id').index()
    table.string('village_id', 14).index()
    table.timestamp('created_at').notNullable()
    table.uuid('created_by').notNullable().index()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
