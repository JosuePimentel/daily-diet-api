import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', table => {
    table.text('user_id').after('id').index().notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', table => {
    table.dropColumn('user_id');
  });
}

