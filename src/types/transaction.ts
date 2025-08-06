import { TransactionType, TransactionCategory, TransactionStatus } from "./enums";

export interface ITransaction {
    id: string;
    reference: string;
    user_id: string;
    sender_account?: string;
    recipient_account?: string;
    amount: number;
    transaction_type: TransactionType;
    transaction_category: TransactionCategory
    transaction_status: TransactionStatus;
    sender_bank?: string;
    recipient_bank?: string;
    beneficiary_name?: string;
    description?: string;
    metadata?: Record<string, unknown>; 
    gateway_reference?: string;
    gateway_response_code?: string;
    gateway_response_message?: string;
    transaction_time: Date;
    created_at: Date;
    updated_at: Date;
    completed_at?: Date;
}