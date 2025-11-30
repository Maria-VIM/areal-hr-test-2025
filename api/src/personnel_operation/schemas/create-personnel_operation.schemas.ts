import Joi from 'joi';

export const CreatePersonnelOperationSchema = Joi.object({
    employee_id: Joi.number().required(),
    department_id: Joi.number().required(),
    job_id: Joi.number().required(),
    salary: Joi.number().required(),
    employment_date: Joi.date().required(),
});
