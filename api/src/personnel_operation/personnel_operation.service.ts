import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { QueryResult } from 'pg';
import { PersonnelOperation } from './enitites/entity-personnel_operation';
import { CreatePersonnelOperationDto } from './dto/create-personnel_operation.dto';
import { UpdatePersonnelOperationDto } from './dto/update-personnel_operation.dto';

@Injectable()
export class PersonnelOperationService {
    constructor(private dbService: DbService) {}
    async findAllById(employee_id: number): Promise<PersonnelOperation[]> {
        const query: QueryResult = await this.dbService.query(
            `SELECT po.id, o.name as organization, d.name as department, j.name as job, salary, dismissal_date
                FROM "Personnel_operation" po JOIN "Job_title" j ON po.job_id = j.id
                JOIN "Department" d ON po.department_id = d.id
                JOIN "Organization" o ON d.organization_id = o.id
                WHERE po.employee_id=$1`,
            [employee_id],
        );
        return query.rows;
    }
    async findOneById(id: number): Promise<PersonnelOperation> {
        const query: QueryResult = await this.dbService.query(
            `SELECT po.id, o.name as organization, d.name as department, j.name as job, 
       salary, employment_date, dismissal_date, po.created_at, po.updated_at
                FROM "Personnel_operation" po JOIN "Job_title" j ON po.job_id = j.id
                JOIN "Department" d ON po.department_id = d.id
                JOIN "Organization" o ON d.organization_id = o.id
                WHERE po.id=$1`,
            [id],
        );
        return query.rows[0];
    }
    async delete(id: number): Promise<PersonnelOperation> {
        try {
            const query: QueryResult = await this.dbService.query(
                `UPDATE "Personnel_operation" SET updated_at = NOW() 
                FROM "Personnel_operation"
                WHERE id = $1 RETURNING *`,
                [id],
            );
            const employeeId: number = query.rows[0].employee_id;
            const check: QueryResult = await this.dbService.query(
                `SELECT COUNT(*) AS active_count
                FROM "Personnel_operation"
                WHERE employee_id = $1 AND dismissal_date IS NULL`,
                [employeeId],
            );
            const activeCount: number = Number(check.rows[0].active_count);
            if (activeCount === 0) {
                await this.dbService.query(
                    `UPDATE "Employee"
                SET deleted_at = NOW()
                WHERE id = $1;`,
                    [employeeId],
                );
            }
            return query.rows[0];
        } catch (error) {
            console.error(error);
            return error;
        }
    }
    async create(
        body: CreatePersonnelOperationDto,
    ): Promise<PersonnelOperation> {
        try {
            const {
                employee_id,
                department_id,
                job_id,
                salary,
                employment_date,
            } = body;
            const query: QueryResult = await this.dbService.query(
                `INSERT INTO "Personnel_operation"(employee_id, department_id, job_id, salary, employment_date) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [employee_id, department_id, job_id, salary, employment_date],
            );
            return query.rows[0];
        } catch (error) {
            console.error(error);
            return error;
        }
    }
    async update(
        id: number,
        body: UpdatePersonnelOperationDto,
    ): Promise<PersonnelOperation> {
        const { department_id, job_id, salary } = body;
        try {
            const query: QueryResult = await this.dbService.query(
                `UPDATE "Personnel_operation" SET updated_at = NOW(),
                    department_id = COALESCE($2, department_id),
                    job_id = COALESCE($3, job_id),
                    salary = COALESCE($4, salary)
                    WHERE id = $1 RETURNING *`,
                [id, department_id, job_id, salary],
            );
            return query.rows[0];
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}
