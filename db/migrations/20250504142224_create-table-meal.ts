import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('meals', table => {
    table.uuid('id').primary();
    table.text('name').notNullable();
    table.text('desc');
    table.integer('inDiet').defaultTo(0).notNullable();
    table.timestamp('date_meal').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('meals');
}

