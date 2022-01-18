import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('testimonials').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('testimonials', (table) => {
        table.uuid('id').primary()
        table.string('name', 100).notNullable()
        table.text('description').notNullable()
        table.string('avatar').notNullable()
        table.string('type', 15).notNullable().index()
        table.boolean('is_active').notNullable().index().defaultTo(true)
        table.uuid('partner_id').index()
        table.string('village_id', 11).index()
        table.timestamp('created_at').notNullable()
        table.uuid('created_by').notNullable().index()
      })
    }
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('testimonials')
}
