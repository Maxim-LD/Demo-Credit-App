import { AccountRepository } from "../repositories/AccountRepository"

const accountRepository = new AccountRepository()

export const generateAccountNumber = async (): Promise<string> => {
    let accountNumber: string
    let isUnique = false

    while (!isUnique) {
        // Generate 10-digit account number
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        accountNumber = `30${timestamp}${random}`.slice(0, 10);

        // Check if unique
        const existing = await accountRepository.findByAccountNumber(accountNumber);
        isUnique = !existing;
    }

    return accountNumber!;
}

export const generateTransactionReference = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN${timestamp}${random}`;
};