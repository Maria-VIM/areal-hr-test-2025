import Joi from 'joi';

export const updateJobSchema = Joi.object({
    name: Joi.string()
        .min(1)
        .max(255)
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
}).min(1);
