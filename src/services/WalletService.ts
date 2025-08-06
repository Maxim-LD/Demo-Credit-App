import db from "../config/db";
import { AccountRepository } from "../repositories/AccountRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { UserRepository } from "../repositories/UserRepository";
import { IAccount } from "../types/account";
import { Currency } from "../types/enums";
import { AppError, NotFoundError } from "../utils/error";
import { generateAccountNumber } from "../utils/generator";
import { nanoid } from "nanoid";

export class WalletService {
    private userRepository: UserRepository
    private accountRepository: AccountRepository
    private transactionRepository: TransactionRepository

    constructor() {
        this.userRepository = new UserRepository();
        this.accountRepository = new AccountRepository();
        this.transactionRepository = new TransactionRepository();
    }

    async createAccount(userId: string): Promise<IAccount | null> {
        return db.transaction(async (trx) => {
            // Check if user exists
            const user = await this.userRepository.findById(userId, trx);
            if (!user) {
                throw new NotFoundError('User not found');
            }

            // Check if account already exists
            const existingAccount = await this.accountRepository.findByUserId(userId, trx);
            if (existingAccount) {
                throw new AppError('User already has an account', 409);
            }

            // Generate unique account number
            const accountNumber = await generateAccountNumber();

            // Create account
            const accountData = {
                id: nanoid(),
                user_id: userId,
                wallet_account_number: accountNumber,
                available_balance: 0,
                total_balance: 0,
                is_restricted: false,
                is_lien_enabled: false,
                is_pnd_enabled: false,
                transaction_limit: parseFloat(process.env.MAX_TRANSFER_AMOUNT || '500000'),
                daily_limit: parseFloat(process.env.MAX_TRANSFER_AMOUNT || '500000'),
                limit_count: 0,
                currency: Currency.Naira
            };

            return this.accountRepository.create(accountData, trx);
        })
    }


}