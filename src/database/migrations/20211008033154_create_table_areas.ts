import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('areas').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('areas', (table) => {
        table.string('id', 4).primary()
        table.string('name', 60).notNullable()
        table.boolean('is_active').notNullable()
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('areas')
}
