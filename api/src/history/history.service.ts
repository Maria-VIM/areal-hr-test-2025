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
            `SELECT h.id, h.old_values, h.new_values, h.created_at, 
            e.first_name || ' ' || e.last_name as fio
        FROM "History" h 
        LEFT JOIN "Employee" e ON h.user_id = e.user_id
        WHERE h.operation_object = $1 AND h.record_id = $2
        ORDER BY h.created_at DESC`,
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
