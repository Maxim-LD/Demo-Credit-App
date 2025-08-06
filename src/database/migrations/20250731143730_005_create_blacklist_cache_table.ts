import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('blacklist_cache', (table) => {
        table.string('id', 21).primary()
        table.string('email', 255).unique().nullable();
        table.string('phone', 20).nullable();
        table.boolean('is_blacklisted').defaultTo(false).notNullable();
        table.timestamp('last_checked').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('expires_at').nullable();
        
        // Indexes
        table.index(['email'], 'idx_blacklist_email');
        table.index(['phone'], 'idx_blacklist_phone');
        table.index(['expires_at'], 'idx_blacklist_expires');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('blacklist_cache');
}
