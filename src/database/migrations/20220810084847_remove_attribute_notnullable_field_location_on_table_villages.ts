import { Knex } from 'knex'

const tableName = 'villages'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropIndex('location')
  })

  return knex.schema.alterTable(tableName, (table) => {
    table.specificType('location', 'POINT').nullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(tableName, (table) => {
    table.specificType('location', 'POINT').notNullable().index().alter()
  })
}
