import { KarmaCheckStatus } from "./enums";

export interface IUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    bvn: string;
    address?: string;
    created_at: Date;
    updated_at: Date;
    is_verified: boolean;
    is_blacklisted: boolean;
    is_active: boolean;
    karma_check_status: KarmaCheckStatus
}