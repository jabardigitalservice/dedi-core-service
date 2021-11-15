import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('villages').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('villages', (table) => {
        table.string('id', 11).primary()
        table.string('name', 60).notNullable()
        table.string('district_id', 8).notNullable().index()
        table.string('area_id', 4).index()
        table.integer('category_id').index().unsigned()
        table.integer('level', 2).index()
        table.string('status', 10).index()
        table.specificType('location', 'POINT').notNullable().index()
        table.json('images')
        table.boolean('is_active').notNullable().index()
        table.timestamp('updated_at').index()
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('villages')
}
