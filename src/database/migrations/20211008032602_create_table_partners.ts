import { Knex } from 'knex'

const tableName = 'partners'

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable(tableName)) {
    return
  }

  return knex.schema.createTable(tableName, (table) => {
    table.uuid('id').primary()
    table.string('name', 100).notNullable().index()
    table.integer('category_id').index().unsigned()
    table.timestamp('deleted_at').index()
    table.timestamp('verified_at')
    table.string('logo')
    table.integer('total_village')
    table.string('website')
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tableName)
}
