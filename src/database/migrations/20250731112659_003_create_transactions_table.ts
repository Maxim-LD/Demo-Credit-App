import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', (table) => {
    // Primary key
    table.string('id', 21).primary()    
    
    // Transaction reference 
    table.string('reference', 100).unique().notNullable();
    
    // User ID for the transaction owner
    table.specificType('user_id', 'char(36)').notNullable();
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Account references for wallet transactions
    table.string('sender_account', 20).nullable(); 
    table.string('recipient_account', 20).nullable(); 
    
    // Foreign key constraints to accounts table
    table.foreign('sender_account').references('wallet_account_number').inTable('accounts').onDelete('RESTRICT');
    table.foreign('recipient_account').references('wallet_account_number').inTable('accounts').onDelete('RESTRICT');
    
    // Transaction amount and fees
    table.decimal('amount', 15, 2).notNullable();
    
    // Transaction type and category
    table.enum('transaction_type', ['credit', 'debit', 'transfer']).notNullable();
    table.enum('transaction_category', [
      'funding',           // External funding (bank transfer, card)
      'withdrawal',        // External withdrawal
      'inter_bank_transfer', // Transfer to different bank
      'intra_bank_transfer', // Internal wallet-to-wallet transfer
      'reversal'           // Transaction reversal
    ]).notNullable();
    
    // Transaction status
    table.enum('transaction_status', [
      'pending',
      'processing', 
      'successful',
      'failed',
      'reversed',
      'cancelled'
    ]).defaultTo('pending').notNullable();
    
    // External bank information (for funding/withdrawal)
    table.string('sender_bank', 100).nullable();
    table.string('recipient_bank', 100).nullable();
    table.string('beneficiary_name', 100).nullable();
    
    // Transaction details and additional data
    table.text('description').nullable();
    table.json('metadata').nullable();
    
    // Payment gateway reference (for external transactions)
    table.string('gateway_reference', 100).nullable();
    table.string('gateway_response_code', 10).nullable();
    table.text('gateway_response_message').nullable();
    
    table.timestamp('transaction_time').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('completed_at').nullable();
    
    // Performance indexes
    table.index(['user_id'], 'idx_transactions_user_id');
    table.index(['reference'], 'idx_transactions_reference');
    table.index(['sender_account'], 'idx_transactions_sender_account');
    table.index(['recipient_account'], 'idx_transactions_recipient_account');
    table.index(['transaction_status'], 'idx_transactions_status');
    table.index(['transaction_category'], 'idx_transactions_category');
    table.index(['transaction_type'], 'idx_transactions_type');
    table.index(['transaction_time'], 'idx_transactions_time');
    table.index(['gateway_reference'], 'idx_transactions_gateway_ref');
    
    // Composite indexes for common query patterns
    table.index(['user_id', 'transaction_time'], 'idx_transactions_user_time');
    table.index(['user_id', 'transaction_status'], 'idx_transactions_user_status');
    table.index(['sender_account', 'transaction_time'], 'idx_transactions_sender_time');
    table.index(['recipient_account', 'transaction_time'], 'idx_transactions_recipient_time');
    table.index(['transaction_status', 'transaction_time'], 'idx_transactions_status_time');
    
    // Business logic constraints
    table.check('amount > 0', [], 'chk_transactions_amount_positive');
    
    //At least one account has to be involved in a transaction
    table.check(
      'sender_account IS NOT NULL OR recipient_account IS NOT NULL',
      [],
      'chk_transactions_account_required'
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('transactions');
}