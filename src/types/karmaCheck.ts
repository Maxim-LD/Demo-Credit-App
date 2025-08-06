import { KarmaCheckStatus } from "./enums";

export interface IKarmaCheckResult {
    karma_identity: string,
    karma_type: string,
    reason?: any,
    status: KarmaCheckStatus,
    checked_at: Date
}