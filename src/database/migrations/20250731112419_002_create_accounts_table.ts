import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('accounts', (table) => {
        table.specificType('id', 'char(36)').primary()
        
        // Foreign key to users table
        table.specificType('user_id', 'char(36)').notNullable().unique();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
        
        // Unique wallet account number
        table.string('wallet_account_number', 20).notNullable().unique();

        // Balance fields
        table.decimal('available_balance', 15, 2).defaultTo(0.00).notNullable();
        table.decimal('total_balance', 15, 2).defaultTo(0.00).notNullable();

        // Transaction and daily limits 
        table.decimal('transaction_limit', 15, 2).defaultTo(100000.00).notNullable(); 
        table.decimal('daily_limit', 15, 2).defaultTo(500000.00).notNullable(); 
        table.decimal('limit_count', 15, 2).defaultTo(0).notNullable(); 
        
        // Account control flags
        table.boolean('is_restricted').defaultTo(false).notNullable();
        table.boolean('is_lien_enabled').defaultTo(false).notNullable();
        table.boolean('is_pnd_enabled').defaultTo(false).notNullable();

        // Account status and currency enum
        table.enum('status', ['active', 'suspended', 'closed']).defaultTo('active').notNullable();
        table.enum('currency', ['NGN', 'USD', 'GBP']).defaultTo('NGN').notNullable();
    
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();

        // Indexes for performance optimization
        table.index(['user_id'], 'idx_accounts_user_id');
        table.index(['wallet_account_number'], 'idx_accounts_wallet_number');
        table.index(['is_restricted'], 'idx_accounts_restricted');
        table.index(['status'], 'idx_accounts_status');
        table.index(['created_at'], 'idx_accounts_created_at');

        // Constraints for business logic
        table.check('available_balance >= 0', [], 'chk_accounts_available_balance_positive');
        table.check('total_balance >= 0', [], 'chk_accounts_total_balance_positive');
        table.check('available_balance <= total_balance', [], 'chk_accounts_available_lte_total');
        table.check('transaction_limit >= 0', [], 'chk_accounts_transaction_limit_positive');
        table.check('daily_limit >= 0', [], 'chk_accounts_daily_limit_positive');
        table.check('limit_count >= 0', [], 'chk_accounts_limit_count_positive');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('accounts');
}
