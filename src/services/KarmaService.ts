import { KarmaCheckStatus } from "../types/enums";
import { IKarmaCheckResult } from "../types/karmaCheck";
import { KarmaAPIError } from "../utils/error";
import logger from "../utils/logger";
import axios from "axios";

export class KarmaService {
    private baseUrl: string
    private secretKey: string

    constructor() {
        this.baseUrl = process.env.KARMA_API_BASE_URL!;
        this.secretKey = process.env.KARMA_API_SECRET_KEY!; 

        if (!this.baseUrl || !this.secretKey) {
            throw new Error('Karma API configuration missing');
        }
    }

    async checkKarma(identity: string, type: 'email' | 'phone' | 'bvn'): Promise<IKarmaCheckResult> {
        try {
            logger.info(`Checking karma for ${type}: ${identity}`);

            const response = await axios.post(
                `${this.baseUrl}/verification/karma/${identity}`,
                {
                    identity_type: type,
                    identity_value: identity
                },
                {
                    headers: {
                        'Authorization': `Bearer $${this.secretKey}`
                    },
                    timeout: 10000 // 10 seconds timeout
                }
            )

            const karmaStatus = response.data.reason === null ? KarmaCheckStatus.Passed : KarmaCheckStatus.Failed;

            logger.info(`Karma check completed for ${identity}: ${karmaStatus}`);

            return {
                karma_identity: identity,
                karma_type: type,
                status: karmaStatus,
                checked_at: new Date()
            };

        } catch (error: any) {
            logger.error(`Karma API check failed for ${identity}:`, error.message);
      
            // if (error.response?.status === 404) {
            //     // Identity not found in blacklist - assume good
            //         return {
            //         karma_identity: identity,
            //         karma_type: type,
            //         status: KarmaCheckStatus.Passed,
            //         checked_at: new Date()
            //     };
            // }
            
            throw new KarmaAPIError(
                error.response?.data?.message || error.message || 'Failed to check karma status'
            );
        }
    }

    async checkMultipleIdentities(identities: Array<{ value: string, type: 'email' | 'phone' | 'bvn' }>): Promise<IKarmaCheckResult[]> {
        const checks = identities.map(identity => 
            this.checkKarma(identity.value, identity.type)
        );
        return Promise.all(checks);
    }


}