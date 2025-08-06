
export enum AccountStatus {
    Active = 'active',
    Suspended = 'suspended',
    Closed = 'closed'
}

export enum KarmaCheckStatus {
    Pending = 'pending',
    Passed = 'passed',
    Failed = 'failed'
}

export enum Currency {
    Naira = 'NGN',
    Dollar = 'USD',
    Pound = 'GBP'
}

export enum TransactionType {
    Credit = 'credit',
    Debit = 'debit',
    Transfer = 'transfer'
}

export enum TransactionCategory {
    Funding = 'funding',
    InterBankTransfer = 'inter_bank_transfer',
    IntraBankTransfer = 'intra_bank_transfer',
    Withdrawal = 'withdrawal',
    Reversal = 'reversal'
}

export enum TransactionStatus {
    Pending = 'pending',
    Successful = 'successful',
    Failed = 'failed',
    Reversed = 'reversed'
}

