export class AppError extends Error {
    public readonly statusCode: number
    public readonly errorCode: string
    public readonly isOperational: boolean
    
    constructor(message: string, statusCode: number, errorCode: string = 'APP_ERROR', isOperational = true) {
        super(message)
        this.errorCode = errorCode
        this.statusCode = statusCode
        
        this.isOperational = isOperational
        this.name = this.constructor.name

        Error.captureStackTrace(this, this.constructor)
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, 'VALIDATION_ERROR')
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: 'Unauthorized access') {
        super(message, 401, 'UNAUTHORIZED')
    }
}

export class ForbiddenError extends AppError {
    constructor(message: 'Access forbidden') {
        super(message, 403, 'FORBIDDEN')
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND')
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT_ERROR');
    }
}

export class InsufficientFundsError extends AppError {
  constructor(requested: number, available: number) {
    super(
      `Insufficient funds. Requested: ₦${requested.toFixed(2)}, Available: ₦${available.toFixed(2)}`,
      400,
      'INSUFFICIENT_FUNDS'
    );
  }
}
export class BlacklistedUserError extends AppError {
    constructor() {
        super('User is blacklisted and cannot be onboarded', 403, 'BLACKLISTED_USER');
    }
}

export class KarmaAPIError extends AppError {
    constructor(message: string) {
      super(`Karma API Error: ${message}`, 503, 'KARMA_API_ERROR');
    }
}

export class TransactionLimitExceededError extends AppError {
    constructor(limit: number) {
      super(`Transaction limit of ₦${limit.toFixed(2)} exceeded`, 400, 'TRANSACTION_LIMIT_EXCEEDED');
    }
}

export class DailyLimitExceededError extends AppError {
    constructor(limit: number) {
      super(`Daily transaction limit of ₦${limit.toFixed(2)} exceeded`, 400, 'DAILY_LIMIT_EXCEEDED');
    }
}

