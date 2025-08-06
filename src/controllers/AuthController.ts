import { catchAsync } from "../middleware/errorHandler";
import { UserRepository } from "../repositories/UserRepository";
import { KarmaService } from "../services/KarmaService";
import { WalletService } from "../services/WalletService";
import { ApiResponse } from "../types";
import { KarmaCheckStatus } from "../types/enums";
import { BlacklistedUserError, ConflictError } from "../utils/error";
import logger from "../utils/logger";
import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";

export class AuthController {
    private userRepository: UserRepository
    private walletService: WalletService
    private karmaService: KarmaService

    constructor() {
        this.userRepository = new UserRepository()
        this.walletService = new WalletService()
        this.karmaService = new KarmaService()
    }

    register = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { email, first_name, last_name, phone, bvn, address } = req.body;

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new ConflictError('User with this email already exists');
        }

        const existingPhone = await this.userRepository.findByPhone(phone);
        if (existingPhone) {
            throw new ConflictError('User with this phone number already exists');
        }

        const existingBVN = await this.userRepository.findByBVN(bvn);
        if (existingBVN) {
            throw new ConflictError('User with this BVN already exists');
        }
    
        // Check Karma Blacklist
        try {
            const identities = [
                { value: email, type: 'email' as const },
                { value: phone, type: 'phone' as const },
                { value: bvn, type: 'bvn' as const }

            ]
            const karrmaResults = await this.karmaService.checkMultipleIdentities(identities)

            const isBlacklisted = karrmaResults.some(result => result.reason !== null)
            if (isBlacklisted) {
                logger.warn(`Blacklisted user attempted registration: ${email}`);
                throw new BlacklistedUserError();
            }
        } catch (error) {
            if (error instanceof BlacklistedUserError) {
                throw error;
            }
        }

        const userData = {
            id: nanoid(),
            email,
            first_name,
            last_name,
            phone,
            bvn,
            address,
            is_verified: false,
            is_active: true,
            is_blacklisted: false,
            karma_check_status: KarmaCheckStatus.Passed
        }

        const user = await this.userRepository.create(userData)

        const account = await this.walletService.createAccount(userData.id)

        logger.info(`New user registered: ${email}`)

        const response: ApiResponse = {
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user?.id,
                    email: user?.email,
                    firstName: user?.first_name,
                    lastName: user?.last_name,
                    phone: user?.phone,
                },
                account: {
                    account_number: account?.wallet_account_number,
                    balance: account?.total_balance,
                    currency: account?.currency
                }

            }
        }

        res.status(201).json(response)
    })
}