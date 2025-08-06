import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transaction_audit', (table) => {
    table.string('id', 21).primary()
    table.specificType('transaction_id', 'char(36)').notNullable();
    table.foreign('transaction_id').references('id').inTable('transactions').onDelete('CASCADE');
    
    table.string('previous_status', 20).nullable();
    table.string('new_status', 20).notNullable();
    table.text('reason').nullable();
    table.json('changed_fields').nullable();
    
    table.specificType('changed_by', 'char(36)').nullable();
    table.foreign('changed_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('changed_at').defaultTo(knex.fn.now()).notNullable();
    
    // Indexes
    table.index(['transaction_id'], 'idx_audit_transaction_id');
    table.index(['changed_at'], 'idx_audit_changed_at');
    table.index(['changed_by'], 'idx_audit_changed_by');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('transaction_audit');
}

