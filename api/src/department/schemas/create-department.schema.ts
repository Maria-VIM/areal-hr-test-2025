import Joi from 'joi';

export const createDepartmentSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    comment: Joi.string()
        .min(5)
        .max(255)
        .required()
        .pattern(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/)
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
            'string.min': 'Name must be at least 5 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'string.pattern.base':
                'Name can only contain letters, numbers, spaces, hyphens and underscores',
        }),
    organization_id: Joi.number().integer().positive().required(),
    parent_id: Joi.number().integer().positive().optional(),
});
