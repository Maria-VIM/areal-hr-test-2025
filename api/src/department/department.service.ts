import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { QueryResult } from 'pg';
import { Department } from './entities/entity-department';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
    constructor(private dbService: DbService) {}
    async findAllByOrganizationId(
        organization_id: number,
    ): Promise<Department[]> {
        const result: QueryResult = await this.dbService.query(
            `SELECT id, name, parent_id, deleted_at FROM "Department" WHERE organization_id = $1`,
            [organization_id],
        );
        return result.rows;
    }
    async findOneById(id: number): Promise<Department> {
        const result: QueryResult = await this.dbService.query(
            `SELECT * FROM "Department" WHERE id = $1`,
            [id],
        );
        return result.rows[0];
    }
    async delete(id: number): Promise<Department> {
        try {
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Department" SET deleted_at = NOW()
                    WHERE id = $1 OR parent_id = $1 RETURNING *`,
                [id],
            );
            return result.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async create(body: CreateDepartmentDto): Promise<Department> {
        try {
            const { name, comment, organization_id, parent_id } = body;
            const result: QueryResult = await this.dbService.query(
                `INSERT INTO "Department" (name, comment, organization_id, parent_id)
             VALUES ($1, $2, $3, $4)
                 RETURNING id, name, comment, organization_id, parent_id, created_at, updated_at`,
                [name, comment, organization_id, parent_id],
            );
            return result.rows[0];
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async update(id: number, body: UpdateDepartmentDto): Promise<Department> {
        try {
            const { name, comment } = body;
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Department" SET name = COALESCE($1, name), 
                        comment = COALESCE($2, comment), updated_at = NOW()
                        WHERE id = $3 RETURNING *`,
                [name, comment, id],
            );
            return result.rows[0];
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async restore(id: number): Promise<Department> {
        try {
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Department" d
                 SET deleted_at = NULL, updated_at = NOW() FROM "Organization" o
                 WHERE d.id = $1 AND o.id = d.organization_id AND o.deleted_at IS NULL
                     RETURNING d.*`,
                [id],
            );
            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
