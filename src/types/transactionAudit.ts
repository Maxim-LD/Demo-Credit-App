export interface ITransactionAudit {
    id: string
    transaction_id: string
    previous_status?: string
    new_status: string
    reason?: string  
    changed_fields?: Record<string, unknown>
    changed_by?: string
    changed_at: Date
}