import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Employee } from './entities/entity-employeee';
import { QueryResult } from 'pg';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
    constructor(private dbService: DbService) {}
    async findAllActiveByOrganization(
        organization_id: number,
    ): Promise<Employee[]> {
        const query: QueryResult = await this.dbService.query(
            `SELECT e.id, e.first_name, e.last_name, e.middle_name, e.deleted_at,
                 JSON_AGG(
                     DISTINCT JSONB_BUILD_OBJECT(
                     'organization_id', o.id,
                     'department_name', d.name,
                     'dismissal_date', po.dismissal_date
                     )
                 ) as organizations
             FROM "Employee" e
                 JOIN "Personnel_operation" po ON po.employee_id = e.id
                 JOIN "Department" d ON d.id = po.department_id
                 JOIN "Organization" o ON o.id = d.organization_id
             WHERE o.id = $1 AND dismissal_date IS NULL
             GROUP BY e.id`,
            [organization_id],
        );
        return query.rows;
    }
    async findAllActiveByDepartment(
        department_id: number,
    ): Promise<Employee[]> {
        const query: QueryResult = await this.dbService.query(
            `SELECT e.id, e.first_name, e.last_name, e.middle_name, e.deleted_at,
                 JSON_AGG(
                     DISTINCT JSONB_BUILD_OBJECT(
                     'department_id', d.id,
                     'department_name', d.name,
                     'dismissal_date', po.dismissal_date
                     )
                 ) as departments
             FROM "Employee" e
                 JOIN "Personnel_operation" po ON po.employee_id = e.id
                 JOIN "Department" d ON d.id = po.department_id
                 JOIN "Organization" o ON o.id = d.organization_id
             WHERE d.id = $1 AND po.dismissal_date IS NULL
             GROUP BY e.id`,
            [department_id],
        );
        return query.rows;
    }
    async findTrainees(): Promise<Employee[]> {
        const query: QueryResult = await this.dbService.query(
            `SELECT e.id, e.first_name, e.last_name, e.middle_name
            FROM "Employee" e WHERE e.deleted_at IS NULL AND e.id NOT IN (select employee_id FROM "Personnel_operation")`,
        );
        return query.rows;
    }
    async findDeleted(): Promise<Employee[]> {
        const query: QueryResult = await this.dbService.query(
            `SELECT e.id, e.first_name, e.last_name, e.middle_name
            FROM "Employee" e WHERE e.deleted_at IS NOT NULL`,
        );
        return query.rows;
    }
    async findAllByName(name: string): Promise<Employee[]> {
        const query: QueryResult = await this.dbService.query(
            `SELECT * FROM "Employee"
            WHERE first_name LIKE $1 OR last_name LIKE $1`,
            ['%' + name + '%'],
        );
        return query.rows;
    }
    async findOneById(id: number): Promise<Employee> {
        const query: QueryResult = await this.dbService.query(
            `SELECT *
             FROM "Employee" WHERE id = $1`,
            [id],
        );
        return query.rows[0];
    }

    async create(body: CreateEmployeeDto): Promise<Employee> {
        try {
            const {
                first_name,
                last_name,
                middle_name,
                date_of_birth,
                passport_data,
                registration_address,
            } = body;
            const query: QueryResult = await this.dbService.query(
                `INSERT INTO "Employee" (first_name, last_name, middle_name, date_of_birth, passport_data, registration_address)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [
                    first_name,
                    last_name,
                    middle_name,
                    date_of_birth,
                    passport_data,
                    registration_address,
                ],
            );
            return query.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async delete(id: number): Promise<Employee> {
        try {
            const query: QueryResult = await this.dbService.query(
                `UPDATE "Employee" SET deleted_at = NOW() 
                  WHERE id = $1 RETURNING *`,
                [id],
            );
            return query.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async update(id: number, body: UpdateEmployeeDto): Promise<Employee> {
        try {
            const {
                first_name,
                last_name,
                middle_name,
                date_of_birth,
                passport_data,
                registration_address,
            } = body;

            const query: QueryResult = await this.dbService.query(
                `UPDATE "Employee" SET
                first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                middle_name = COALESCE($3, middle_name),
                date_of_birth = COALESCE($4, date_of_birth),
                passport_data = COALESCE($5, passport_data),
                registration_address = COALESCE($6, registration_address)
                 WHERE id = $7 RETURNING *`,
                [
                    first_name,
                    last_name,
                    middle_name,
                    date_of_birth,
                    passport_data,
                    registration_address,
                    id,
                ],
            );
            return query.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
