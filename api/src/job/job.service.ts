import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { QueryResult } from 'pg';
import { Job } from './entities/entity-job';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobService {
    constructor(private dbService: DbService) {}
    async findAllActive(): Promise<Job[]> {
        const result: QueryResult = await this.dbService.query(
            `SELECT id, name, deleted_at FROM "Job_title"
                WHERE deleted_at IS NULL`,
        );
        return result.rows;
    }
    async findOneById(id: number): Promise<Job> {
        const result: QueryResult = await this.dbService.query(
            `SELECT * FROM "Job_title" WHERE id = $1`,
            [id],
        );
        return result.rows[0];
    }
    async findByName(name: string): Promise<Job[]> {
        const result: QueryResult = await this.dbService.query(
            `SELECT id, name, deleted_at FROM "Job_title" WHERE name ILIKE $1`,
            [`%${name}%`],
        );
        return result.rows;
    }
    async delete(id: number): Promise<Job> {
        try {
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Job_title"
             SET deleted_at = NOW() WHERE id = $1 RETURNING *`,
                [id],
            );
            return result.rows[0] || null;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async create(body: CreateJobDto): Promise<Job> {
        try {
            const { name } = body;
            const result: QueryResult = await this.dbService.query(
                `INSERT INTO "Job_title" (name) VALUES ($1)
                RETURNING id, name`,
                [name],
            );
            return result.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async update(id: number, body: UpdateJobDto): Promise<Job> {
        try {
            const { name } = body;
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Job_title" SET name = COALESCE($2, name), updated_at = NOW()
                WHERE id=$1 RETURNING *`,
                [id, name],
            );
            return result.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async restore(id: number): Promise<Job> {
        try {
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Job_title" SET deleted_at = null, updated_at = NOW()
                WHERE id=$1 RETURNING *`,
                [id],
            );
            return result.rows[0];
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}
