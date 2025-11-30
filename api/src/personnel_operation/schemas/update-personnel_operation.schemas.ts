import Joi from 'joi';

export const UpdatePersonnelOperationSchema = Joi.object({
    department_id: Joi.number().optional(),
    job_id: Joi.number().optional(),
    salary: Joi.number().optional(),
}).min(1);
