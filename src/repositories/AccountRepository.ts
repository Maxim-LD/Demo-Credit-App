import { IAccount } from "../types/account";
import { BaseRepository } from "./BaseRepository";
import { Knex } from "knex";

export class AccountRepository extends BaseRepository<IAccount> {
    constructor() {
        super('accounts')
    }

    async findByUserId(userId: string, trx?: Knex.Transaction): Promise<IAccount | null> {
        const query = this.db(this.tableName).where('user_id', userId).first()
        if (trx) query.transacting(trx)
        return query
    }

    async findByAccountNumber(accountNumber: string, trx?: Knex.Transaction): Promise<IAccount | null> {
        const query = this.db(this.tableName).where('wallet_account_number', accountNumber).first();
        if (trx) query.transacting(trx);
        return query
    }

    async updateBalance(
        accountId: string,
        availableBalance: number,
        totalBalance: number,
        trx?: Knex.Transaction
    ): Promise<IAccount | null> {
        return this.update(accountId, {
            available_balance: availableBalance,
            total_balance: totalBalance
        }, trx);
    }

    async incrementLimitCount(accountId: string, trx?: Knex.Transaction): Promise<IAccount | null> {
    const query = this.db(this.tableName)
        .where('id', accountId)
        .increment('limit_count', 1)
        .update('updated_at', new Date())
        .returning('*');
        if (trx) query.transacting(trx);
        const [result] = await query;
        return result || null;
    }

    async resetLimitCount(accountId: string, trx?: Knex.Transaction): Promise<IAccount | null> {
        return this.update(accountId, { limit_count: 0 }, trx);
    }
}