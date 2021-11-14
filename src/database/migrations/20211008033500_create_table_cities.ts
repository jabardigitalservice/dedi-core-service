import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('cities').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('cities', (table) => {
        table.string('id', 5).primary()
        table.string('name', 60).notNullable()
        table.boolean('is_active').notNullable().index()
        table.string('area_id', 4).index()
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('cities')
}
