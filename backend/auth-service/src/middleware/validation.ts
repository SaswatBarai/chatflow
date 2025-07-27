import Joi from 'joi';
import { Request, Response, NextFunction, response } from 'express';

const Schema = {
    register: Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Email must be a valid email address",
            "string.empty": "Email is required"
        }),

        password: Joi.string().min(6).max(128).messages({
            "string-min": "Password must be at least 6 characters long",
            "string.max": "Password must not exceed 128 characters",
            "any.required": "Password is required"
        }),
        firstName: Joi.string().trim().max(50).required().messages({
            "string.max": "First name must not exceed 50 characters",
            "any.required": "First name is required"
        }),
        lastName: Joi.string().trim().max(50).required().messages({
            "string.max": "Last name must not exceed 50 characters",
            "any.required": "Last name is required"
        }),
        phone: Joi.string().trim().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
            "string.pattern.base": "Phone number must be a valid international format",
            "string.empty": "Phone number cannot be empty"
        })

    }),

    login: Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Email must be a valid email address",
            "string.empty": "Email is required"
        }),
        password: Joi.string().min(6).max(128).required().messages({
            "string.min": "Password must be at least 6 characters long",
            "string.max": "Password must not exceed 128 characters",
            "any.required": "Password is required"
        })
    }),

    verifyOTP: Joi.object({
        identifier: Joi.string().required(),
        code: Joi.string().length(6).required(),
        type: Joi.string().valid('email', 'phone').required()
    }),

    sendOTP: Joi.object({
        identifier: Joi.string().required(),
        type: Joi.string().valid('email', 'phone').required(),
        purpose: Joi.string().valid('registration', 'login', 'password-reset').required()
    })
}


const validate = (schemaName: keyof typeof Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const schema = Schema[schemaName];
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }))

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            })
        }

        req.body = value;
        next();


    }
}