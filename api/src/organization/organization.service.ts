import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from './entities/entity-organization';
import { QueryResult } from 'pg';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
    constructor(private dbService: DbService) {}
    async findAll(): Promise<Organization[]> {
        const result: QueryResult = await this.dbService.query(
            `SELECT id, name, deleted_at
                FROM "Organization"`,
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
        const { name, comment } = body;
        const result: QueryResult = await this.dbService.query(
            `INSERT INTO "Organization"(name, comment) VALUES ($1, $2)
                RETURNING id, name, comment, created_at`,
            [name, comment],
        );
        return result.rows[0];
    }
    async update(
        id: number,
        body: UpdateOrganizationDto,
    ): Promise<Organization> {
        const { name, comment, deleted_at } = body;
        const result = await this.dbService.query(
            `UPDATE "Organization" 
                SET name = COALESCE($1, name), comment = COALESCE($2, comment), updated_at = NOW(), deleted_at = $4 WHERE id = $3 
                RETURNING *`,
            [name, comment, id, deleted_at],
        );
        return result.rows[0];
    }
    async delete(id: number): Promise<Organization> {
        const result: QueryResult = await this.dbService.query(
            `UPDATE "Organization" SET deleted_at = NOW() WHERE id = $1 RETURNING *`,
            [id],
        );
        await this.dbService.query(
            `UPDATE "Department" SET deleted_at = NOW() WHERE organization_id = $1`,
            [id],
        );
        return result.rows[0];
    }
}
