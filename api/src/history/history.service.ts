import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { QueryResult } from 'pg';
import { CreateHistoryDto } from './dto/create-history.dto';
import { history } from './entities/entity-history';

@Injectable()
export class HistoryService {
    constructor(private dbService: DbService) {}
    async getAll(entity: string, id: number): Promise<history[]> {
        const result: QueryResult = await this.dbService.query(
            `SELECT old_values, new_values, h.created_at, e.first_name || ' ' || e.last_name as fio 
        FROM "History" h JOIN "Employee" e ON h.user_id = e.user_id
        WHERE operation_object = $1 AND record_id = $2`,
            [entity, id],
        );
        return result.rows;
    }
    async create(data: CreateHistoryDto): Promise<history> {
        try {
            const {
                user_id,
                operation_object,
                record_id,
                old_values,
                new_values,
            } = data;
            const result: QueryResult = await this.dbService.query(
                `
                INSERT INTO "History" (
                    operation_object,
                    record_id,
                    old_values,
                    new_values,
                    user_id
                ) VALUES ($1, $2, $3, $4, $5)
                        RETURNING *
            `,
                [operation_object, record_id, old_values, new_values, user_id],
            );
            return result.rows[0].id;
        } catch (error) {
            console.error('Ошибка при записи в историю:', error);
            throw error;
        }
    }
}
