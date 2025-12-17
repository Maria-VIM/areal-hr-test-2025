import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Employee } from './entities/entity-employeee';
import { QueryResult } from 'pg';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { HistoryService } from '../history/history.service';
import { logEntityChanges } from '../history/log';

@Injectable()
export class EmployeeService {
    constructor(
        private dbService: DbService,
        private historyService: HistoryService,
    ) {}
    async findAll(
        page: number = 1,
        pageSize: number = 10,
        organization_id?: number,
        department_id?: number,
        name?: string,
        is_deleted?: boolean,
    ): Promise<{
        employees: Employee[];
        totalPages: number;
        totalCount: number;
    }> {
        const offset = (page - 1) * pageSize;
        const params: any[] = [];
        const whereConditions: string[] = [];

        const baseFrom = `
        FROM "Employee" e
        JOIN "Personnel_operation" po ON po.employee_id = e.id
        JOIN "Department" d ON d.id = po.department_id
        JOIN "Organization" o ON o.id = d.organization_id`;

        if (department_id) {
            whereConditions.push(`d.id = $${params.length + 1}`);
            params.push(department_id);
        } else if (organization_id) {
            whereConditions.push(`o.id = $${params.length + 1}`);
            params.push(organization_id);
        }
        if (is_deleted) {
            whereConditions.push(`e.deleted_at IS NOT NULL`);
        } else {
            whereConditions.push(`e.deleted_at IS NULL`);
        }
        if (name) {
            whereConditions.push(
                `(e.first_name ILIKE $${params.length + 1} OR e.last_name ILIKE $${params.length + 1})`,
            );
            params.push(`%${name}%`);
        }
        const whereClause =
            whereConditions.length > 0
                ? `WHERE ${whereConditions.join(' AND ')}`
                : '';
        const countQuery = `SELECT COUNT(DISTINCT e.id) ${baseFrom} ${whereClause}`;
        const countResult = await this.dbService.query(countQuery, params);
        const totalCount = parseInt(countResult.rows[0].count, 10);
        const mainQuery = `
        SELECT e.id, e.first_name, e.last_name, e.middle_name, e.deleted_at,
            JSON_AGG(
                DISTINCT JSONB_BUILD_OBJECT(
                    'organization_id', o.id,
                    'department_id', d.id,
                    'dismissal_date', po.dismissal_date
                )
            ) as organizations
        ${baseFrom}
        ${whereClause}
        GROUP BY e.id
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        const queryParams = [...params, pageSize, offset];
        const result = await this.dbService.query(mainQuery, queryParams);
        return {
            employees: result.rows,
            totalPages: Math.ceil(totalCount / pageSize),
            totalCount: totalCount,
        };
    }

    async findAllActive() {
        const query: QueryResult = await this.dbService.query(
            `SELECT *
             FROM "Employee" WHERE deleted_at IS NULL`,
        );
        return query.rows;
    }

    async findTrainees(
        page: number,
        pageSize: number,
        name?: string,
    ): Promise<{
        employees: Employee[];
        totalPages: number;
        totalCount: number;
    }> {
        const offset = (page - 1) * pageSize;
        const params: any[] = [];
        let whereClause =
            'WHERE e.deleted_at IS NULL AND e.id NOT IN ' +
            '(SELECT employee_id FROM "Personnel_operation")';
        if (name) {
            whereClause += ` AND (e.first_name ILIKE $${params.length + 1} OR e.last_name ILIKE $${params.length + 1})`;
            params.push(`%${name}%`);
        }
        const baseQuery = `SELECT e.id, e.first_name, e.last_name, e.middle_name FROM "Employee" e ${whereClause}`;
        const countQuery = `SELECT COUNT(*) FROM "Employee" e ${whereClause}`;
        const countResult = await this.dbService.query(countQuery, params);
        const paginatedQuery = `${baseQuery} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        const paginatedParams = [...params, pageSize, offset];
        const result = await this.dbService.query(
            paginatedQuery,
            paginatedParams,
        );
        const totalCount = parseInt(countResult.rows[0].count, 10);
        return {
            employees: result.rows,
            totalPages: Math.ceil(totalCount / pageSize),
            totalCount: totalCount,
        };
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
    async update(
        id: number,
        body: UpdateEmployeeDto,
        history_user_id: number,
    ): Promise<Employee> {
        try {
            const {
                first_name,
                last_name,
                middle_name,
                date_of_birth,
                passport_data,
                registration_address,
                user_id,
            } = body;
            const oldRecord: QueryResult = await this.dbService.query(
                `SELECT * FROM "Employee" WHERE id=$1`,
                [id],
            );
            const old_row = oldRecord.rows[0];
            const query: QueryResult = await this.dbService.query(
                `UPDATE "Employee" SET
                first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                middle_name = COALESCE($3, middle_name),
                date_of_birth = COALESCE($4, date_of_birth),
                passport_data = COALESCE($5, passport_data),
                registration_address = COALESCE($6, registration_address),
                user_id = COALESCE($8, user_id)
                WHERE id = $7 RETURNING *`,
                [
                    first_name,
                    last_name,
                    middle_name,
                    date_of_birth,
                    passport_data,
                    registration_address,
                    id,
                    user_id,
                ],
            );
            const new_row = query.rows[0];
            await logEntityChanges(this.historyService, {
                entity: 'Employee',
                old_row,
                new_row,
                user_id: history_user_id,
            });
            return new_row;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
