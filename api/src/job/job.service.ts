import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { QueryResult } from 'pg';
import { Job } from './entities/entity-job';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { logEntityChanges } from '../history/log';
import { HistoryService } from '../history/history.service';

@Injectable()
export class JobService {
    constructor(
        private dbService: DbService,
        private historyService: HistoryService,
    ) {}
    async findAll(page: number = 1, pageSize: number = 10): Promise<any> {
        const offset: number = (page - 1) * pageSize;
        const countResult: QueryResult = await this.dbService.query(
            `SELECT COUNT(*) FROM "Job_title"`,
        );
        const totalCount: number = parseInt(countResult.rows[0].count, 10);
        const totalPages: number = Math.ceil(totalCount / pageSize);
        const result: QueryResult = await this.dbService.query(
            `SELECT id, name, deleted_at FROM "Job_title" LIMIT $1 OFFSET $2`,
            [pageSize, offset],
        );
        return {
            jobs: result.rows,
            totalPages: totalPages,
            totalCount: totalCount,
        };
    }

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
    async findByName(
        name: string,
        page: number = 1,
        pageSize: number = 10,
    ): Promise<any> {
        const offset: number = (page - 1) * pageSize;
        const countResult: QueryResult = await this.dbService.query(
            `SELECT COUNT(*) FROM "Job_title" WHERE name ILIKE $1`,
            [`%${name}%`],
        );
        const totalCount: number = parseInt(countResult.rows[0].count, 10);
        const totalPages: number = Math.ceil(totalCount / pageSize);
        const result: QueryResult = await this.dbService.query(
            `SELECT id, name, deleted_at FROM "Job_title" WHERE name ILIKE $1
                LIMIT $2 OFFSET $3`,
            [`%${name}%`, pageSize, offset],
        );
        return {
            jobs: result.rows,
            totalPages: totalPages,
            totalCount: totalCount,
        };
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
    async update(
        id: number,
        body: UpdateJobDto,
        user_id: number,
    ): Promise<Job> {
        try {
            const { name } = body;
            const oldRecord: QueryResult = await this.dbService.query(
                `SELECT * FROM "Job_title" WHERE id = $1`,
                [id],
            );
            const old_row = oldRecord.rows[0];
            const result: QueryResult = await this.dbService.query(
                `UPDATE "Job_title" SET name = COALESCE($2, name), updated_at = NOW()
                WHERE id=$1 RETURNING *`,
                [id, name],
            );
            const new_row = result.rows[0];
            await logEntityChanges(this.historyService, {
                entity: 'Job_title',
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
