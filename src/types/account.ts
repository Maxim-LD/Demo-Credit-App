import { AccountStatus, Currency } from "./enums";

export interface IAccount {
    id: string;
    user_id: string;
    wallet_account_number: string;
    available_balance: number;
    total_balance: number;
    transaction_limit: number;
    daily_limit: number;
    limit_count: number;
    is_restricted: boolean;
    is_lien_enabled: boolean;
    is_pnd_enabled: boolean;
    status: AccountStatus;
    currency: Currency;
    created_at: Date;
    updated_at: Date;
}
