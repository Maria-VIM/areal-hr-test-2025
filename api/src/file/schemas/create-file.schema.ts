import Joi from 'joi';

export const CreateFileSchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
            'string.min': 'Name must be at least 1 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    full_name: Joi.string()
        .min(1)
        .max(255)
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
            'string.min': 'Name must be at least 1 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
});
