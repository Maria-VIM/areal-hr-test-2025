import Joi from 'joi';

export const CreateUserSchema = Joi.object({
    role_id: Joi.number().required(),
    login: Joi.string()
        .min(2)
        .max(255)
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .required()
        .messages({
            'string.empty': 'Login is required',
            'any.required': 'Login is required',
            'string.min': 'Login must be at least 2 characters long',
            'string.max': 'Login cannot exceed 255 characters',
            'string.pattern.base':
                'Login can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    password: Joi.string().required(),
});
