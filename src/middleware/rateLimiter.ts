import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export const globalRateLimit = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    skip: (req: Request) => {
        // Skip rate limiting for successful requests
        return req.method === 'GET';
    }
});

export const transactionRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 transaction requests per minute
    message: {
        success: false,
        message: 'Too many transaction requests, please slow down.'
    }
});