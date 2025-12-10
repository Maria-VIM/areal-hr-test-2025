import Joi from 'joi';

export const UpdateUserSchema = Joi.object({
    role_id: Joi.number().optional(),
    login: Joi.string()
        .min(2)
        .max(255)
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .optional()
        .messages({
            'string.min': 'Login must be at least 2 characters long',
            'string.max': 'Login cannot exceed 255 characters',
            'string.pattern.base':
                'Login can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    password: Joi.string().optional(),
}).min(1);
