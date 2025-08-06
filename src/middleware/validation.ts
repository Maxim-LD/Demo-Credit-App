import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/error';

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new ValidationError(errorMessage));
        }
        
        next();
    };
};

// Validation schemas
export const registerSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    first_name: Joi.string().trim().min(2).max(50).required().messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name must not exceed 50 characters',
        'any.required': 'First name is required'
    }),
    last_name: Joi.string().trim().min(2).max(50).required().messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name must not exceed 50 characters',
        'any.required': 'Last name is required'
    }),
    phone: Joi.string().trim().pattern(/^\+234[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be in format +234XXXXXXXXXX',
        'any.required': 'Phone number is required'
    }),
    bvn: Joi.string().trim().length(11).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'BVN must be exactly 11 digits',
        'string.pattern.base': 'BVN must contain only numbers',
        'any.required': 'BVN is required'

    }),
    address: Joi.string().max(255).allow('', null).optional()
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    })
});

export const fundWalletSchema = Joi.object({
    amount: Joi.number().positive().precision(2).required().messages({
        'number.positive': 'Amount must be a positive number',
        'any.required': 'Amount is required'
    }),
    description: Joi.string().max(255).optional()
});

export const transferFundsSchema = Joi.object({
    recipientAccountNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'Account number must be exactly 10 digits',
        'string.pattern.base': 'Account number must contain only numbers',
        'any.required': 'Recipient account number is required'
    }),
    amount: Joi.number().positive().precision(2).required().messages({
        'number.positive': 'Amount must be a positive number',
        'any.required': 'Amount is required'
    }),
    description: Joi.string().max(255).optional()
});

export const withdrawFundsSchema = Joi.object({
    amount: Joi.number().positive().precision(2).required().messages({
        'number.positive': 'Amount must be a positive number',
        'any.required': 'Amount is required'
    }),
    bankDetails: Joi.object({
        bankName: Joi.string().required().messages({
            'any.required': 'Bank name is required'
        }),
        accountNumber: Joi.string().min(10).max(10).pattern(/^[0-9]+$/).required().messages({
            'string.length': 'Account number must be exactly 10 digits',
            'string.pattern.base': 'Account number must contain only numbers',
            'any.required': 'Account number is required'
        }),
        accountName: Joi.string().required().messages({
            'any.required': 'Account name is required'
        })
    }).required().messages({
            'any.required': 'Bank details are required'
    })
});
