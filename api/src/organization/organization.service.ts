import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/entity-organization';
import { QueryResult } from 'pg';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { HistoryService } from '../history/history.service';
import { logEntityChanges } from '../history/log';

@Injectable()
export class OrganizationService {
    constructor(
        private dbService: DbService,
        private historyService: HistoryService,
    ) {}
    async findAll(): Promise<Organization[]> {
        const result: QueryResult = await this.dbService.query(
            `SELECT id, name, deleted_at
                FROM "Organization"`,
        );
        return result.rows;
    }
    async findAllActive(): Promise<Organization[]> {
        const result: QueryResult = await this.dbService.query(
            `SELECT id, name
                FROM "Organization" WHERE deleted_at IS NULL`,
        );
        return result.rows;
    }
    async findOneById(id: number): Promise<Organization> {
        const result: QueryResult = await this.dbService.query(
            `SELECT * FROM "Organization"
                WHERE id = $1`,
            [id],
        );
        return result.rows[0];
    }
    async findByName(name: string): Promise<Organization[]> {
        const result: QueryResult = await this.dbService.query(
            `SELECT id, name FROM "Organization" WHERE name ILIKE $1`,
            [`%${name}%`],
        );
        return result.rows;
    }
    async create(body: CreateOrganizationDto): Promise<Organization> {
        try {
            const { name, comment } = body;
            const result: QueryResult = await this.dbService.query(
                `INSERT INTO "Organization"(name, comment) VALUES ($1, $2)
                RETURNING id, name, comment, created_at`,
                [name, comment],
            );
            return result.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async update(
        id: number,
        body: UpdateOrganizationDto,
        user_id: number,
    ): Promise<Organization> {
        try {
            const { name, comment } = body;
            const oldRecord: QueryResult = await this.dbService.query(
                `SELECT * FROM "Organization" WHERE id = $1`,
                [id],
            );
            const old_row = oldRecord.rows[0];
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Organization" 
                SET name = COALESCE($1, name), comment = COALESCE($2, comment), updated_at = NOW() WHERE id = $3 
                RETURNING *`,
                [name, comment, id],
            );
            const new_row = result.rows[0];
            await logEntityChanges(this.historyService, {
                entity: 'Organization',
                old_row,
                new_row,
                user_id: user_id,
            });
            return new_row;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async restore(id: number): Promise<Organization> {
        try {
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Organization" 
                SET deleted_at = null, updated_at = NOW() WHERE id = $1 
                RETURNING *`,
                [id],
            );
            return result.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async delete(id: number): Promise<Organization> {
        try {
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Organization" SET deleted_at = NOW() WHERE id = $1 RETURNING *`,
                [id],
            );
            await this.dbService.query(
                `UPDATE "Department" SET deleted_at = NOW() WHERE organization_id = $1`,
                [id],
            );
            return result.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
