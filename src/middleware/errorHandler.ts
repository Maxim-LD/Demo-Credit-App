import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import logger from '../utils/logger';
import { ApiResponse } from '../types';

// Async error wrapper
export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Main error handler
export const errorHandler = (error: Error, req: Request, res: Response,  next: NextFunction): void => {
    let statusCode = 500;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let isOperational = false;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        errorCode = error.errorCode;
        isOperational = error.isOperational;
    }

    // Log error - dev mode
    if (process.env.NODE_ENV === 'development' || !isOperational) {
        logger.error('Error occurred:', {
            error: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    }

    // Hide internal details
    if (process.env.NODE_ENV === 'production' && !isOperational) {
        message = 'Something went wrong. Please try again later.';
        errorCode;
    }

    const response: ApiResponse = {
        success: false,
        message,
        error: {
            code: errorCode,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        }
    };

    res.status(statusCode).json(response);
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response): void => {
    const response: ApiResponse = {
        success: false,
        message: `Route ${req.originalUrl} not found`,
        error: {
            code: 'NOT_FOUND'
        }
    };
    res.status(404).json(response);
};