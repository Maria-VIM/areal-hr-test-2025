import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
    first_name: Joi.string()
        .min(2)
        .max(255)
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    last_name: Joi.string()
        .min(2)
        .max(255)
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    middle_name: Joi.string()
        .min(2)
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .max(255)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    date_of_birth: Joi.date().required(),
    passport_data: Joi.string()
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .required()
        .messages({
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    registration_address: Joi.string()
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .required()
        .messages({
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    user_id: Joi.number().optional(),
});
