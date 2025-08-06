export interface IBlacklistCache {
    id: string;
    email: string;
    phone: string;
    is_blacklisted: boolean
    last_checked: Date
    expires_at?: Date;
}