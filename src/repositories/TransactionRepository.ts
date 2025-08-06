import { ITransaction } from "../types/transaction";
import { BaseRepository } from "./BaseRepository";
import { Knex } from "knex";

export class TransactionRepository extends BaseRepository<ITransaction> {
    constructor() {
        super('transactions')
    }

    async findByReference(reference: string, trx?: Knex.Transaction): Promise<ITransaction | null> {
        const query = this.db(this.tableName).where('reference', reference).first()
        if (trx) query.transacting(trx)
        return query
    }

    async findByUserId(
        userId: string,
        limit = 10,
        offset = 0,
        trx?: Knex.Transaction
    ): Promise<ITransaction[]> {
        const query = this.db(this.tableName)
            .where('user_id', userId)
            .orderBy('transaction_time', 'desc')
            .limit(limit)
            .offset(offset);
        if (trx) query.transacting(trx);
        return query;
    }

    async findByAccountNumber(
        accountNumber: string,
        limit = 10,
        offset = 0,
        trx?: Knex.Transaction
    ): Promise<ITransaction[]> {
        const query = this.db(this.tableName)
            .where('sender_account', accountNumber)
            .orWhere('recipient_account', accountNumber)
            .orderBy('transaction_time', 'desc')
            .limit(limit)
            .offset(offset);
        if (trx) query.transacting(trx);
        return query;
    }
    
    async findTransactionsByDateRange(
        userId: string,
        startDate: Date,
        endDate: Date,
        trx?: Knex.Transaction
    ): Promise<ITransaction[]> {
        const query = this.db(this.tableName)
        .where('user_id', userId)
        .whereBetween('transaction_time', [startDate, endDate])
        .orderBy('transaction_time', 'desc');
        if (trx) query.transacting(trx);
        return query;
    }

    async findPendingTransactions(trx?: Knex.Transaction): Promise<ITransaction[]> {
        const query = this.db(this.tableName).where('transaction_status', 'pending');
        if (trx) query.transacting(trx);
        return query;
    }
    
    async updateStatus(transactionId: string,
        status: ITransaction['transaction_status'],
        trx?: Knex.Transaction
    ): Promise<ITransaction | null> {
        return this.update(transactionId, { transaction_status: status }, trx);
    }
}