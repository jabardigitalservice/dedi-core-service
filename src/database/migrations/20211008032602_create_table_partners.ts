import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('partners').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('partners', (table) => {
        table.uuid('id').primary()
        table.string('name', 100).notNullable().index()
        table.integer('category_id').index().unsigned()
        table.timestamp('deleted_at')
        table.timestamp('verified_at')
        table.string('logo')
        table.integer('total_village')
        table.string('website')
        table.timestamp('created_at').notNullable().index()
        table.timestamp('updated_at')
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('partners')
}
