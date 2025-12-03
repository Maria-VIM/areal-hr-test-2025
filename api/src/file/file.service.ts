import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { File } from './entity/entity-file';
import { QueryResult } from 'pg';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FileService {
    constructor(private dbService: DbService) {}
    async findAllByEmployee(employee_id: number): Promise<File[]> {
        const query: QueryResult = await this.dbService.query(
            `SELECT * FROM "File" WHERE deleted_at IS NULL AND id IN 
                           (select file_id from "Passport_scan" WHERE employee_id = $1)`,
            [employee_id],
        );
        return query.rows;
    }
    async findOneByIdForDownload(id: number): Promise<File> {
        const query: QueryResult = await this.dbService.query(
            `SELECT * FROM "File" WHERE id = $1`,
            [id],
        );
        return query.rows[0];
    }
    async create(body: CreateFileDto): Promise<File> {
        try {
            const { employee_id, name, full_name } = body;
            const query: QueryResult = await this.dbService.query(
                `INSERT INTO "File" (name, full_name) VALUES ($1, $2) RETURNING *`,
                [name, full_name],
            );
            const fileId = query.rows[0].id;
            await this.dbService.query(
                `INSERT INTO "Passport_scan" (employee_id, file_id) VALUES ($1, $2)`,
                [employee_id, fileId],
            );
            return query.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async delete(id: number): Promise<File> {
        try {
            const query = await this.dbService.query(
                `UPDATE "File" SET deleted_at = NOW() WHERE id = $1 RETURNING *`,
                [id],
            );
            return query.rows[0];
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
