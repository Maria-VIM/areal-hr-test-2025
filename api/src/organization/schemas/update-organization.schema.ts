import Joi from 'joi';

export const updateOrganizationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .optional()
        .pattern(/^[a-zA-Z0-9\s\-_]+$/)
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    comment: Joi.string()
        .min(5)
        .max(255)
        .optional()
        .pattern(/^[a-zA-Z0-9\s\-_]+$/)
        .messages({
            'string.min': 'Name must be at least 5 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    deleted_at: Joi.date().allow(null).optional(),
}).min(1);
