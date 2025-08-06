import { IUser } from "../types/user";
import { BaseRepository } from "./BaseRepository";
import { Knex } from "knex";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super('users')
    }

    async findByEmail(email: string, trx?: Knex.Transaction): Promise<IUser | null> {
        const query = this.db(this.tableName).where('email', email).first()
        if (trx) query.transacting(trx)
        return query
    }

    async findByPhone(phone: string, trx?: Knex.Transaction): Promise<IUser | null> {
        const query = this.db(this.tableName).where('phone', phone).first()
        if (trx) query.transacting(trx)
        return query
    }

    async findByBVN(bvn: string, trx?: Knex.Transaction): Promise<IUser | null> {
        const query = this.db(this.tableName).where('bvn', bvn).first();
        if (trx) query.transacting(trx);
        return query;
    }
    async findBlacklistedUsers(trx?: Knex.Transaction): Promise<IUser[]> {
        const query = this.db(this.tableName).where('is_blacklisted', true);
        if (trx) query.transacting(trx);
        return query;
    }

    async findActiveUsers(trx?: Knex.Transaction): Promise<IUser[]> {
        const query = this.db(this.tableName).where({
            is_active: true,
            is_blacklisted: false,
            account_status: 'active'
        });
        if (trx) query.transacting(trx);
        return query;
    }
}

