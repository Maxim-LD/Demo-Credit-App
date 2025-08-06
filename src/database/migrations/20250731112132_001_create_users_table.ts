import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.string('id', 21).primary()
        table.string('email', 255).notNullable().unique();
        table.string('first_name', 100).notNullable();
        table.string('last_name', 100).notNullable();
        table.string('phone', 20).notNullable().unique();
        table.string('bvn', 11).notNullable().unique();
        table.string('address', 255).nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
        table.boolean('is_verified').defaultTo(false).notNullable();
        table.boolean('is_blacklisted').defaultTo(false).notNullable();
        table.boolean('is_active').defaultTo(true).notNullable(); 

        // Karma check status
        table.enum('karma_check_status', ['pending', 'passed', 'failed']).defaultTo('pending').notNullable();
        
        // Performance indexes
        table.index(['email'], 'idx_users_email');
        table.index(['phone'], 'idx_users_phone');
        table.index(['bvn'], 'idx_users_bvn');
        table.index(['is_blacklisted'], 'idx_users_blacklisted');
        table.index(['is_active'], 'idx_users_active');
        table.index(['karma_check_status'], 'idx_users_karma_status');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}
